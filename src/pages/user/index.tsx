import {useContext, useEffect, useState} from 'react';
import {Context} from '@/context';
import UserRoute from '@/components/routes/UserRoute';
import axios from "axios";

interface UserData {
  username: string;
  picture_link: string;
  employee_profile: Record<string, string>;
  brand_partner_profile: Record<string, string>;
}

export const UserIndex = () => {
  const {state: { user }} = useContext(Context);
  const [userData, setUserData] = useState<UserData>({
    username: 'unknown',
    picture_link: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png',
    employee_profile: {},
    brand_partner_profile: {}
  });


  const isBrandPartner = user?.role === 'BRAND_PARTNER';

  const getUser = async (login: string) => {
    const mutation = isBrandPartner ? {
      query: `query {
            getOneUser(username: "${login}") {
              id
              picture_link
             brand_partner_profile { name, description }
            }
        }`
    } : {
      query: `query {
            getOneUser(username: "${login}") {
              id
              picture_link
             employee_profile { name, description, contact_number, gender, date_of_birth, education, experience, contact_email, style, description }
            }
        }`
    }

    const { data } = await axios({
      method: 'post',
      url: 'https://tattoo-server.onrender.com/graphql',
      data: mutation,
      headers: { 'Content-Type': 'application/json' },
    });

    return data.data.getOneUser;
  }

  useEffect( () => {
    (async () => {
      const currentUserData = await getUser(user?.username as string);
      await setUserData(currentUserData);
      console.log(userData);
    })();
  }, []);

  return (
    <UserRoute>
      <div className="container profile">
        <div className="row">
          <div className="col-md-8">
            <h1 className={'profile_title'}>{user?.username}</h1>
            <img className={'profile_picture'} src={user?.picture_link} alt=""/>
          </div>
        </div>

          {
            isBrandPartner ? (
                <div className="row">
                <div className="col-md-8">
                  <p>Name: {userData.brand_partner_profile?.name || '-'}</p>
                  <p>Description: {userData.brand_partner_profile?.description || '-'}</p>
                </div>
                </div>
                ) :
                (
                    <div className="row">
                      <div className="col-md-8">
                        <p>Name: {userData.employee_profile?.name || '-'}</p>
                        <p>Contact number: {userData.employee_profile?.contact_number || '-'}</p>
                        <p>Gender: {userData.employee_profile?.gender || '-'}</p>
                        <p>Date of birth: {userData.employee_profile?.date_of_birth || '-'}</p>
                        <p>Education: {userData.employee_profile?.education || '-'}</p>
                        <p>Experience: {userData.employee_profile?.experience || '-'}</p>
                        <p>Contact Email: {userData.employee_profile?.contact_email || '-'}</p>
                        <p>Styles: {userData.employee_profile?.style?.split('&').join(', ') || '-'}</p>
                        <p>Description: {userData.employee_profile?.description || '-'}</p>
                      </div>
                    </div>
                )
            }
      </div>
    </UserRoute>
  );
};

export default UserIndex;