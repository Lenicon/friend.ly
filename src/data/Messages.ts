import Img1 from "../assets/img/defaultAvatar.jpg";
import Img2 from "../assets/img/cocaine.jpg";

export const SeedMessages = [
    { id: 1, owner: false, message: "Hi!", images: [] },
    {
        id: 2,
        owner: true,
        message: "suck my d pls",
        images: []
    },
    { id: 3, owner: false, message: 'thisll be ez, u barely got anything', images: [] },
    {
        id: 4,
        owner: false,
        message: "suck these",
        images: [Img2],
    },
    {
        id: 5,
        owner: true,
        message: "ill send nudes sowwy",
        images: [Img2, Img1, Img2]
    }
]