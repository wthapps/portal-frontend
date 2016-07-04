export interface Toast {
    id: string
    type: string
    createdOn: Date
    title?: string
    content?: string
    override?: any
    html?: any
}
