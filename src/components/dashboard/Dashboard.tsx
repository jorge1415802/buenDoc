import React, { useEffect, useState } from 'react'
import { Alert, Button, Table, Spin, Space, Modal, Form, Input, Select, Pagination } from 'antd';
import { useQuery } from 'react-query';
import { useForm } from '../../hooks/useForm';
import { useLanguages } from '../../hooks/useLanguages';
import Swal from 'sweetalert2'


export const Dashboard = () => {

    interface Professionals {
        key: number;
        id: number;
        first_name: string,
        last_name: string,
        profile_image: string,
        email: string,
        is_active: boolean,
    }


    const [state1, setState] = useState({
        isModalVisible: false,
        selected: false,
        professionalSelected: {},
        professional_id: 0,
    });
    const [form] = Form.useForm();
    const [state, handleInputChange] = useForm({
        first_name: '',
        email: '',
        last_name: ''

    })
    const [profile_image, setProfileImage]: any = useState();
    const [languages, setLanguages]: any = useState([]);
    const [imageUrl, setImageUrl]: any = useState()
    const [languageId, setLanguageId]: any = useState([]);
    const [defaultSelect, setDefaultSelect]: any = useState([]);
    const [changeLanguage, setChangeLanguage] = useState(false);
    const defaultValueSelect: any[] = [];
    const { Option } = Select;



    const query4 = useLanguages();


    const children: any[] = [];
    query4.data?.map((child: any) => {
        return children.push(<Option key={child.id} value={child.id}>{child.name}</Option>)
    });



    const { isModalVisible, selected, professionalSelected }: { isModalVisible: boolean, selected: boolean, professionalSelected: any } = state1;
    const { first_name, email, last_name } = state;



    const doctors = async () => {
        try {
            const result: any = await fetch('http://challenge.radlena.com/api/v1/professionals/');
            return result.json();
        } catch (error: any) {
            throw new Error("Error intentando acceder a los datos");
        }

    }

    const moreDoctors = async () => {
        try {
            const result: any = await fetch('http://challenge.radlena.com/api/v1/professionals/?page=2');
            return result.json();
        } catch (error) {
            throw new Error("Error intentando acceder a los datos");
        }
    }

    const getLanguagesDoctor = async () => {
        try {
            const result: any = await fetch('http://challenge.radlena.com/api/v1/professional-languages/');
            return result.json();
        } catch (error) {
            throw new Error("Error intentando acceder a los datos");
        }
    }


    const query = useQuery('DOCTORS', doctors);
    const query2 = useQuery('MOREDOCTORS', moreDoctors);
    const query3 = useQuery('LANGUAGESDOCTOR', getLanguagesDoctor);

    useEffect(() => {
        setDefaultSelect(defaultValueSelect);
        const data: any[] = query3.data?.filter((item: any) => item.professional.id === professionalSelected.id)
        data?.map((item: any) => {
            return defaultSelect.push(item.language?.id)
        })
        setLanguageId(defaultSelect);
        // setDefaultSelect(defaultSelect);
        console.log(defaultSelect)
    }, [professionalSelected])

    // useMemo(() => useEffect, [defaultSelect])


    const dataSource: Professionals[] = [];
    query.data?.results.map((res: Professionals) => {
        const data = {
            ...res,
            key: res.id
        }
        return dataSource.push(data);
    });

    query2.data?.results.map((res: Professionals) => {
        const data = {
            ...res,
            key: res.id
        }
        return dataSource.push(data);
    })


    if (query.isLoading) {
        return (
            <div className="container text-center mt-4">
                <Space size="middle">
                    <Spin size="large" />
                </Space>
            </div>
        )
    }

    if (query.isError) {
        return (
            <Alert message="Error cargando doctores" type="error" />
        )
    }

    const showModal = () => {
        if (selected) {
            setState({
                ...state1,
                selected: false,
                isModalVisible: true
            })
        }
        else {
            return (
                <Alert message="Error no se selecciono un profesional" type="error" />
            )
        }

    }

    const handleCancel = () => {
        setDefaultSelect([]);
        setChangeLanguage(false);
        setState({
            ...state1,
            isModalVisible: false
        })
    }

    const handleFile = ({ target }: { target: any }) => {
        setProfileImage(target.files[0]);
        const url = URL.createObjectURL(target.files[0]);
        setImageUrl(url)
    }

    function handleChange(value: any) {
        setChangeLanguage(true);
        setLanguages([
            ...value
        ])
    }

    const verify = async () => {
        try {
            await form.validateFields();
            console.log('todo ok');
            const edit = await editDoctor();
            console.log(edit);
            // const doct = await newDoctor();
            // await newDoctorLanguages(doct);

        } catch (error) {
            console.log('todo mal');
            console.log(error);
        }

    }




    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: Professionals[]) => {
            setState({
                ...state,
                selected: true,
                professionalSelected: selectedRows[0]
            });

            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
            // dataForm();

            form.setFieldsValue({
                first_name: selectedRows[0].first_name,
                email: selectedRows[0].email,
                last_name: selectedRows[0].last_name,
                profile_image: null,
                languageId: defaultSelect
            })


            setImageUrl(selectedRows[0].profile_image)
            console.log("image url")
            console.log(imageUrl)
        },
        getCheckboxProps: (record: Professionals) => ({
            disabled: record.first_name === 'Disabled User', // Column configuration not to be checked
            name: record.first_name,
        }),
    };




    const editDoctor = async () => {
        try {
            const formData = new FormData();
            if (!first_name) formData.append('first_name', professionalSelected.first_name);
            else formData.append('first_name', first_name);
            if (!last_name) formData.append('last_name', professionalSelected.last_name);
            else formData.append('last_name', last_name);
            if (!email) formData.append('email', professionalSelected.email);
            else formData.append('email', email);
            if (!profile_image) formData.append('profile_image', professionalSelected.profile_image);
            else formData.append('profile_image', profile_image!);

            const editProf  = await fetch(`http://challenge.radlena.com/api/v1/professionals/${professionalSelected.id}/`, {
                method: 'PATCH',
                body: formData
            })
            const data = await editProf.json()
            console.log(data)
            if(editProf.ok) {
                if(changeLanguage) await createLanguages();
                else {
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'Modificacion exitosa',
                        showConfirmButton: true
                    }).then((result) => {
                        if(result.isConfirmed) {
                            query.refetch();
                            query2.refetch();
                            handleCancel();
                        }
                    })
                }
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `${editProf.statusText}`
                });
            }
            

        } catch (error) {

        }

    }

    const createLanguages = async () => {
        try {
            let langId: any[] = [];
            let lang: any[] = [];
            console.log(languages)
            console.log(changeLanguage)
            if (changeLanguage) {
                if(languages.length >  languageId.length) {
                    languages.map((la: any) => {
                        if (!languageId.find((item: any) => item === la)) langId.push(la)
                    })
                }
                else {
                    languageId.map((la: any) => {
                        if (!languages.find((item: any) => item === la)) langId.push(la)
                    })
                }
                

                console.log(langId)

                for (let index = 0; index < langId.length; index++) {
                    const element = langId[index];
                    lang.push(query4.data.find((lang: any) => lang.id === element));
                }

                if (languages.length > languageId.length) {
                    for (let index = 0; index < lang.length; index++) {
                        const element = lang[index];
                        const { first_name, email, last_name, id } = professionalSelected;
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
                        console.log(data)
                        const rest = await fetch('http://challenge.radlena.com/api/v1/professional-languages/', {
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
                                title: 'Modificacion exitosa',
                                showConfirmButton: true
                            }).then((result) => {
                                if(result.isConfirmed) {
                                    query3.refetch();
                                    handleCancel();
                                }
                            })
                        }
                        else if (!rest.ok) {
                            const result = await rest.json();
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: `${result}`
                            });
                        }
                    }
                }
                else {
                    for (let index = 0; index < lang.length; index++) {
                        const element = lang[index];
                        const proffesionalLanguages = await fetch(`http://challenge.radlena.com/api/v1/professional-languages/`);
                        const result = await proffesionalLanguages.json();
                        console.log(result);

                        const dataIdLanguages = result.filter((item : any) => item.professional.id === professionalSelected.id);
                        console.log(dataIdLanguages);
                        const dataElement = dataIdLanguages.find((item : any) => item.language.id === element.id)
                        console.log(dataElement)
                        

                        const deleteLang = await fetch(`http://challenge.radlena.com/api/v1/professional-languages/${dataElement.id}`, {
                            method: 'DELETE'
                        });
                        if (deleteLang.ok && index === lang.length - 1) {
                            Swal.fire({
                                position: 'center',
                                icon: 'success',
                                title: 'Modificacion exitosa',
                                showConfirmButton: true
                            }).then((result) => {
                                if(result.isConfirmed) {
                                    query3.refetch();
                                    handleCancel();
                                }
                            })
                        }
                        else if (!deleteLang.ok) {
                            const result = await deleteLang.json();
                            Swal.fire({
                                icon: 'error',
                                title: 'Error',
                                text: `${result}`
                            });
                        }
                    }
                }
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Algo salio mal',
            });
        }
    }

    const dataForm = () => {
        console.log(professionalSelected.id)
        console.log(query3)
        if (!query3.isError) {
            const data = query3.data?.filter((item: any) => item.professional.id === professionalSelected.id)
            console.log("data")
            console.log(data);
            setLanguageId([
                ...data
            ])
        }
        else {
            <Alert message="Error" type="error" />
        }
    }

    const deleteProfessional = async () => {
        dataForm();
        console.log("vector id languages")
        console.log(languageId);
        try {
            const deleteProf = await fetch(`http://challenge.radlena.com/api/v1/professionals/${professionalSelected.id}`, {
                method: 'DELETE'
            })

            if (deleteProf.ok) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Borrado Exitoso',
                    showConfirmButton: true
                }).then((result) => {
                    if (result.isConfirmed) {
                        query.refetch();
                        query2.refetch();
                    }
                });
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: `${deleteProf}`
                });
            }
            // if(languageId.length > 0) {
            //     for (let index = 0; index < languageId.length; index++) {
            //         const element : any = languageId[index];
            //         const deleteLang = await fetch(`http://challenge.radlena.com/api/v1/professional-languages/${element.id}`, {
            //         method: 'DELETE'
            //         });

            //         if (deleteLang.ok && index === languageId.length - 1) {


            //         }
            //         else if(!deleteLang.ok && index === languageId.length - 1) {
            //             Swal.fire({
            //                 icon: 'error',
            //                 title: 'Error',
            //                 text: 'Algo salio mal',
            //             });
            //         }
            //     }
            // }
            // else {
            //     Swal.fire({
            //         icon: 'error',
            //         title: 'Error',
            //         text: 'El Profesional no tiene lenguajes y no puede ser borrado',
            //     });
            // }

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Algo salio mal',
            });
        }


    }

    const handlePagination = () => {
        console.log("hola");
    }

    const columns = [
        {
            title: 'Avatar',
            dataIndex: 'profile_image',
            key: 'profile_image',
            render: (profile_image: any) => <img style={{ width: '4%' }} src={profile_image} alt={profile_image} />
        },
        {
            title: 'Nombre',
            dataIndex: 'first_name',
            key: 'first_name'
        },
        {
            title: 'Apellido',
            dataIndex: 'last_name',
            key: 'last_name'
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        }

    ];
    return (
        <>
            <div className="container p-3">
                <h1>Profesionales</h1>
                <br />
                <hr />
                <div className="row">
                    <div className="col-2">
                        <Button type="primary" onClick={showModal}>Editar</Button>
                    </div>
                    <div className='col-2'>
                        <Button type="primary" danger onClick={deleteProfessional}>Borrar</Button>
                    </div>
                </div>
                <br />
                <Modal title="Editar Profesional" width={800} visible={isModalVisible} onOk={verify} onCancel={handleCancel}>
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
                            <Input size="large" placeholder="Email" name="last_name" autoComplete="off" value={last_name} onChange={handleInputChange} />
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
                        <label htmlFor="Url">Url Imagen</label>
                        <Form.Item
                            name='imageUrl'
                        >
                            <img src={imageUrl} alt={imageUrl} className='form-control' style={{ width: '20%' }} />
                        </Form.Item>

                        <Form.Item
                            name="profile_image"
                        >
                            <Input type="file" size="large" placeholder="Url" name="profile_image" autoComplete="off" value={profile_image} onChange={handleFile} />
                        </Form.Item>
                        <label htmlFor="Languages">Lenguajes</label>
                        <Form.Item
                            name="languageId"
                        >
                            <Select
                                mode="multiple"
                                allowClear
                                // defaultValue={languageId}
                                style={{ width: '100%' }}
                                placeholder="Selecciona un lenguaje"
                                onChange={handleChange}
                            >
                                {children}
                            </Select>
                        </Form.Item>

                        {/* <Form.Item>
                            <Button type="primary" onClick={verify}>
                                Guardar
                            </Button>
                        </Form.Item> */}
                    </Form>
                </Modal>
                <Table
                    rowSelection={{
                        type: 'radio',
                        ...rowSelection
                    }}
                    dataSource={dataSource}
                    columns={columns} />
                {/* <Pagination defaultCurrent={1} defaultPageSize={10} onChange={handlePagination} /> */}
            </div>
        </>
    )
}
