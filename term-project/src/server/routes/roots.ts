import express from 'express';
import {Request, Response} from 'express';


const myFunction = () => {
    console.log('Hello from myFunction!');
}

myFunction.myName = 'John';


const router = express.Router();

router.get('/', (_request: Request, response: Response) => {
    const title = 'BS - Site'
    const name = 'John';

    // {title , name} same as

    // const obj = {
    //     title: title,
    //     name: name
    // }
    
    response.render('root', {title, name});
});

export default router;