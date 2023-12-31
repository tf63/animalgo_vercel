import base64
from PIL import Image
import io
import numpy as np
import requests
import os

from .transdata import *


API_URL = "https://api-inference.huggingface.co/models/facebook/detr-resnet-50-panoptic"
HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
headers = {"Authorization": f"Bearer {HUGGINGFACE_API_KEY}"}


def create_segmentation(data):
    """_summary_

    imput:

        data : binary data


    Returns:
        PIL image object
    """

    # original imageの読み込み
    original_image = binary2image(data)
    if original_image.mode != "RGBA":
        original_image = original_image.convert("RGBA")
        alpha_data = [(r, g, b, 255) for r, g, b, _ in original_image.getdata()]
        original_image.putdata(alpha_data)
    # original_image.save("mediafiles/tests/animals/test_da3l.png")

    # 画像をnumpyに変換
    original_array = np.array(original_image)

    # hugging face requests
    response = requests.post(API_URL, headers=headers, data=data)

    status = response.status_code

    if status == 200:
        # "LABEL_"のものを除外する
        output = [
            entry
            for entry in response.json()
            if not entry["label"].startswith("LABEL_")
        ]

        # maskの生成
        mask = np.zeros(original_array.shape[:2], dtype=np.uint8)
        for entry in output:
            # "mask"の値を取得
            mask_str = entry["mask"]

            # Base64デコード
            mask_bytes = base64.b64decode(mask_str)

            # デコードされたバイト列を画像として読み込む
            mask_image = Image.open(io.BytesIO(mask_bytes))

            # 元の画像と同じサイズにセグメンテーションマスクをリサイズする
            mask_image = mask_image.resize(original_image.size)

            # マスク画像をnumpy配列に変換
            mask_array = np.array(mask_image) / 255

            # 得られたマスクとひとまとまりにする
            mask = np.bitwise_or(mask, mask_array.astype(np.uint8))

        # maskが真っ黒なら全部表示させる
        if np.max(mask) == 0:
            mask = np.ones(original_array.shape[:2])

        if original_array.shape == mask.shape:
            segmented_image = original_array * mask
        else:
            segmented_image = original_array * mask[..., np.newaxis]
            # converted_mask = np.where(mask == 0, 239, 0).astype(np.uint8)
            # converted_mask = np.expand_dims(converted_mask, axis=2)
            # segmented_image += converted_mask

        # 切り抜かれた領域をImageオブジェクトとして作成
        segmented_image = Image.fromarray(segmented_image.astype(np.uint8))
    else:
        segmented_image = original_image

    return status, segmented_image


if __name__ == "__main__":
    # animalの指定

    animal = "dal"

    # 拡張子
    ends = ["jpg", "jpeg", "png"]
    # ファイルがあればopenしてdataに
    for end in ends:
        filename = f"mediafiles/tests/animals/{animal}.{end}"
        if os.path.isfile(filename):
            with open(filename, "rb") as f:
                data = f.read()
            break

    # print(data, type(data))
    # data = binary2np(data)

    # segmentation
    status, output = create_segmentation(data)

    image_size = 250
    output.thumbnail((image_size, image_size))

    w, h = output.size

    new_image = Image.new("RGBA", (image_size, image_size), (0, 0, 0, 0))

    left = (image_size - w) // 2
    top = (image_size - h) // 2
    new_image.paste(output, (left, top))

    # セグメンテーションimageを保存する
    new_image.save(f"mediafiles/tests/animals/testsegmentation_{animal}.png")
