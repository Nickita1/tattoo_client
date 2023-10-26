export interface User {
    id: string;
    username: string;
    role: string;
    picture_link: string;
}


export interface State {
    user: User | null;
}
export interface UserAction {
    type: string;
    payload?: User;
}