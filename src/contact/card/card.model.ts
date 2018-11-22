export interface Card {
    uuid: string;
    cart_type: string;

    name: string;
    first_name: string;
    last_name: string;
    user_name: string;
    nickname: string;
    email: string;
    phone_number: string;
    link: string;

    birthday: Date;
    sex: number;
    profile_image: string;
    cover_image: string;
    company: string;
    occupation: string;
    nationality: string;
    public_fields: string[];
    card_json: any;
    user_id: number;
}



      