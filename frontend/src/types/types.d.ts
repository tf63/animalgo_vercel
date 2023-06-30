export type Category = {
    id: number
    label: string
    label_ja: string
    image: string
}

export type Individual = {
    id: number
    image: string
    score: number
    category: number
    label: string
    label_ja: string
}

export type CategoryDetail = {
    id: number
    label: string
    label_ja: string
    ecology: string
    trivia: string
    type: string
    hp: number
    attack: number
    defense: number
    magic_attack: number
    magic_defense: number
    speed: number
}

export type Status = {
    hp: number
    attack: number
    defense: number
    magic_attack: number
    magic_defense: number
    speed: number
}

export type Trivia = {
    label: string
    label_ja: string
    trivia: string
}

export type TriviaList = Trivia[]
