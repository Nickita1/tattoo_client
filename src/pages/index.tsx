import axios from "axios";
import {useEffect, useState} from "react";

const Home = () => {

    const [users, setUsers] = useState<Record<string, string>[]>([]);

    const getUsers = async () => {
        const query = {
                query: `query {
                    getAllUsers(take: 200 skip: 0) {
                        id
                        username
                        picture_link
                        role
                    }
                }`
        }

        const { data } = await axios({
            method: 'post',
            url: 'https://tattoo-server.onrender.com/graphql',
            data: query,
            headers: { 'Content-Type': 'application/json' },
        });

        return data;
    }

    useEffect(() => {
        getUsers().then(((usersData) => setUsers(usersData.data.getAllUsers)));
        getUsers().then(console.log);

    }, []);

 return <>
     <h1 className={'jumbotron text-center bg-primary square'}>Tattoo</h1>
     <div className={'container'}>
         <div className="row">
             {users.map((user) => <div className={'col-md-6'}>
                 <div className={'user_preview'}>
                     <img src={user.picture_link} alt='' />
                     <p>{user.username}</p>
                     <p>{user.role}</p>
                 </div>
             </div>)}
         </div>
     </div>
 </>
};

export default Home;
