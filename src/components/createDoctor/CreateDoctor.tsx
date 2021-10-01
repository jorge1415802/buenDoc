import React, { useState } from 'react'
import { Input, Form, Button, Select, Alert } from 'antd';
import { useForm } from '../../hooks/useForm';
import { useLanguages } from '../../hooks/useLanguages';
import { useHistory } from 'react-router'
import Swal from 'sweetalert2'


export const CreateDoctor = () => {

    const [form] = Form.useForm();
    const [state, handleInputChange] = useForm({
        first_name: '',
        email: '',
        last_name: '',
        // languages: []
    })
    const [profile_image, setProfileImage]: any = useState();
    const [fileUrl, setFileUrl]: any = useState();
    const [displayImage, setDisplayImage] = useState('none');
    const [languages, setLanguages]: any = useState([]);
    const { first_name, email, last_name } = state;
    const { Option } = Select;
    let history = useHistory();

    const query = useLanguages();

    if (query.isError) {
        return (
            <Alert message="Error cargando los lenguajes" type="error" />
        )
    }

    const children: any[] = [];
    query.data?.map((child: any) => {
        return children.push(<Option key={child.id} value={child.id}>{child.name}</Option>)
    });

    function handleChange(value: any) {
        setLanguages([
            ...value
        ])
    }

    const handleFile = ({ target }: { target: any }) => {
        console.log(target.files[0])
        const imageUrl = URL.createObjectURL(target.files[0]);
        setProfileImage(target.files[0]);
        setFileUrl(imageUrl);
        setDisplayImage('block')
    }

    const newDoctor = async () => {
        let res: any;
        let msg : any;
        let formData = new FormData();
        const { first_name, email, last_name } = state
        formData.append('profile_image', profile_image!);
        formData.append('first_name', first_name);
        formData.append('email', email);
        formData.append('last_name', last_name)
        console.log(profile_image)
        res = await fetch('http://challenge.radlena.com/api/v1/professionals/', {
            method: 'POST',
            body: formData
        })
        const rest = res.json();
        let result =  await rest;
        if(result.email) msg = result.email[0];
        else msg = result.non_field_errors[0];
        try {
            if (res.ok) {
                return rest;
            }
            else {
                console.log("entro en else");
                console.log(result)
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `${msg}`,
                });
            }

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `${msg}`,
            });
        }

    }

    const newDoctorLanguages = async (doctor: any) => {
        let rest: any;
        try {
            let lang: any[] = []
            for (let index = 0; index < languages.length; index++) {
                const element = languages[index];
                lang.push(query.data.find((lang: any) => lang.id === element));
            }
            console.log(lang);
            for (let index = 0; index < lang.length; index++) {
                const element = lang[index];
                const { first_name, email, last_name, id } = doctor;
                const data = {
                    professional: {
                        first_name,
                        last_name,
                        email
                    },
                    professional_id: id,
                    language: {
                        name: element.name,
                        code: element.code,
                        is_active: element.is_active,
                    },
                    language_id: element.id
                }
                rest = await fetch('http://challenge.radlena.com/api/v1/professional-languages/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                })
                if (rest.ok && index === lang.length - 1) {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Creacion exitosa',
                        showConfirmButton: true,

                    }).then((result) => {
                        if (result.isConfirmed) {
                            history.push('/dashboard');
                        }
                    })
                }
                else if (!rest.ok) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error',
                        text: `${rest}`
                    });
                }
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `${rest}`
            });
        }
    }

    const verify = async () => {
        try {
            await form.validateFields();
            console.log('todo ok');
            const doct = await newDoctor();
            if(doct) await newDoctorLanguages(doct);
            

        } catch (error) {
            console.log('todo mal');
            console.log(error);
        }

    }
    return (
        <>
            <div className="container">
                <h1 className="titulo">Nuevo Profesional</h1>
                <h3>Ingrese los datos del profesional</h3>
                <hr />
                <br />
                <Form form={form} encType="multipart/form">
                    <label htmlFor="Nombre">Nombre</label>
                    <Form.Item
                        name="first_name"
                        rules={[
                            {
                                required: true,
                                message: 'El nombre es obligatorio'
                            }
                        ]}
                    >
                        <Input size="large" placeholder="Nombre" name="first_name" autoComplete="off" value={first_name} onChange={handleInputChange} />
                    </Form.Item>
                    <label htmlFor="Apellido">Apellido</label>
                    <Form.Item
                        name="last_name"
                        rules={[
                            {
                                required: true,
                                message: 'El apellido es obligatorio'
                            }
                        ]}
                    >
                        <Input size="large" placeholder="Apellido" name="last_name" autoComplete="off" value={last_name} onChange={handleInputChange} />
                    </Form.Item>
                    <label htmlFor="Email">Email</label>
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'El email es obligatorio'
                            }
                        ]}
                    >
                        <Input size="large" placeholder="Email" name="email" autoComplete="off" value={email} onChange={handleInputChange} />
                    </Form.Item>
                    <img src={fileUrl} alt={profile_image?.name} className='form-control' style={{ display: displayImage, width: '20%' }} />
                    <label htmlFor="Url">Url Imagen</label>
                    <Form.Item
                        name="profile_image"
                        rules={[
                            {
                                required: true,
                                message: 'La url de la imagen es obligatoria'
                            }
                        ]}
                    >
                        <Input type="file" size="large" placeholder="Url" name="profile_image" autoComplete="off" value={profile_image} onChange={handleFile} />
                    </Form.Item>
                    <label htmlFor="Languages">Lenguajes</label>
                    <Form.Item
                        name="languages"
                        rules={[
                            {
                                required: true,
                                message: 'Es necesario seleccionar un lenguaje'
                            }
                        ]}
                    >
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="Selecciona un lenguaje"
                            onChange={handleChange}
                        >
                            {children}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" onClick={verify}>
                            Guardar
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    )
}
