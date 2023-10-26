import React, {FormEvent, useContext, useEffect, useState} from 'react';
import axios from 'axios';
import type { DatePickerProps } from 'antd';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import {ApiValidationError} from '@/utils/api';
import {Context} from '@/context';
import { useRouter } from 'next/router';
import { Switch, Space, DatePicker, Select, Typography } from 'antd';
import {EmployeeGender, EmployeeStyle} from '@/types';

const Register = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [gender, setGender] = useState<EmployeeGender>(EmployeeGender.MALE);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [education, setEducation] = useState('');
  const [experience, setExperience] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [style, setStyle] = useState('');
  const [isBrandPartner, setIsBrandPartner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { state: { user } } = useContext(Context);
  const router = useRouter();

  useEffect(() => {
    user && router.push('/');
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const onChangeDate: DatePickerProps['onChange'] = (date, dateString) => setDateOfBirth(dateString);

  const onChangeGender = (gender: EmployeeGender) => setGender(gender);

  const onChangeStyles = (styles: string[]) => setStyle(styles.join('&'));

  const mutation = isBrandPartner ? {
    query: 'mutation createUser($user: CreateUserInput!, $uploadedFile: Upload!) { createUser(createUser: $user, uploadedFile: $uploadedFile) {id username password picture_link brand_partner_profile { name } }}',
    variables: {
      user: {
        username: login,
        password,
        brand_partner_profile: {
          name, description
        }
      },
      uploadedFile: null
    }
  } : {
    query: 'mutation createUser($user: CreateUserInput!, $uploadedFile: Upload!) {  createUser(createUser: $user, uploadedFile: $uploadedFile) { id username picture_link password employee_profile { name, gender, date_of_birth } }}',
    variables: {
      user: {
        username: login,
        password,
        employee_profile: {
          name,
          description,
          gender,
          date_of_birth: dateOfBirth,
          education,
          experience,
          contact_number: contactNumber,
          contact_email: contactEmail,
          style
        } 
      },
      uploadedFile: null
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      setIsLoading(true)
      if (!dateOfBirth && !isBrandPartner) return toast.error('Missed date of birth');

      const bodyFormData = new FormData();

      bodyFormData.append('operations', JSON.stringify(mutation));
      bodyFormData.append('map', JSON.stringify({'0': ['variables.uploadedFile']}));

      if(!selectedFile) return toast.error('Missed image');

      bodyFormData.append('0', selectedFile);

      const { data } = await axios({
        method: 'post',
        url: 'https://tattoo-server.onrender.com/graphql',
        data: bodyFormData,
        headers: { 'Content-Type': 'multipart/form-data', 'Apollo-Require-Preflight': true },
      });

      const { errors } = data;

      if(errors) return errors.map((error: ApiValidationError) => toast.error(error.message));

      toast.success('Registration successful. Please login.');

      await router.push('/login');
    } catch (err: unknown) {
      return toast.error('Unexpected error during registration.');
    } finally {
      setIsLoading(false);
    }
  };
  return <>
    <h1 className={'jumbotron text-center bg-primary square'}>Register</h1>
    <div className={'container col-12 pb-5 mt-5'}>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className={'col-md-6'}>
            <input
              value={login}
              placeholder='Enter login'
              onChange={(event) => setLogin(event.target.value)}
              type="text"
              className={'form-control mb-4 p-4'}
              required
            />

            <input
              type='password'
              className={'form-control mb-4 p-4'}
              value={password}
              placeholder='Enter password'
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <input 
              type="file" 
              className={'form-control mb-4 p-4'} 
              name="fileName" 
              onChange={handleFileChange}
            />

            <Switch
              className={'mb-5 w-30'}
              onChange={() => setIsBrandPartner(!isBrandPartner)}
              checkedChildren="Master"
              unCheckedChildren="Studio"
              defaultChecked />

            <div className="submit-button">
              {isLoading ? <Spinner /> : <button type = 'submit' className={'btn col-12 btn-primary'}>Submit</button>}
            </div>
          </div>
          <div className={'col-md-6'}>
            <input
              type='text'
              className={'form-control mb-4 p-4'}
              value={name}
              placeholder='Enter name'
              onChange={(event) => setName(event.target.value)}
              required
            />
            <input
              type='text'
              className={'form-control mb-4 p-4'}
              value={description}
              placeholder='Enter description'
              onChange={(event) => setDescription(event.target.value)}
              required
            />
            {!isBrandPartner &&
              <>
                <textarea
                  className={'form-control mb-4 p-4'}
                  value={education}
                  placeholder='Tell about your education'
                  onChange={(event) => setEducation(event.target.value)}
                  required
                />
                <input
                  type='tel'
                  className={'form-control mb-4 p-4'}
                  value={contactNumber}
                  placeholder='Phone number'
                  onChange={(event) => setContactNumber(event.target.value)}
                  required
                />
                <input
                  type='email'
                  className={'form-control mb-4 p-4'}
                  value={contactEmail}
                  placeholder='Contact email'
                  onChange={(event) => setContactEmail(event.target.value)}
                  required
                />

                <DatePicker className={'form-control mb-4 p-4'} placeholder='Date of birthday' onChange={onChangeDate} />

                <Select
                  mode="multiple"
                  placeholder="Please select styles"
                  className={'form-control mb-4 p-4'}
                  onChange={onChangeStyles}
                  options={
                    (Object.keys(EmployeeStyle) as Array<keyof typeof EmployeeStyle>).map((key) => ({
                      label: key,
                      value: key,
                    }))
                  }
                />
                <Select
                  defaultValue={EmployeeGender.MALE}
                  className={'form-control mb-4 p-4'}
                  onChange={onChangeGender}
                  options={[
                    { value: EmployeeGender.MALE, label: 'Male' },
                    { value: EmployeeGender.FEMALE, label: 'Female' },
                    { value: EmployeeGender.ANOTHER, label: 'Another' }
                  ]}
                />
              </>
            }          
          </div>
        </div>
      </form>
    </div>
  </>;
};

export default Register;
