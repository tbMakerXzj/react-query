import { useState } from 'react';
import { useMutation } from 'react-query';
import { Form, Input, Button, message } from 'antd';
import './styles/login.css';
import http from './http';
const Item = Form.Item

interface ITable {
    username?: string,
    password?: string
}

const Login: React.FC = () => {

    const [form] = Form.useForm()
    const [loading, setLoading] = useState<boolean>(false)
    const [, setformData] = useState<ITable>({})

    // const useValidate = () => useQuery(['todos'], getData)
    // 获取数据
    const getData = async (val: any) => {
        setLoading(true)
        const result = await http.postValidate('/auth/login', val)
        console.log('1', result);
        if (result) {
            if (result?.code === 0) {
                message.success(result?.msg || '登陆成功！')
            } else {
                message.error(result?.msg || '网络错误，请稍后再试')
            }
        }
        setLoading(false)
    }

    const mutation: any = useMutation(getData, {})

    // 登录
    const onFinish = async () => {
        const values = await form.validateFields()
        // setLoading(true)
        setformData(values)

        mutation.mutate(values)
    }

    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 24 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 24 },
        },
    };

    // 验证
    const validate = (values: any, type: 'email' | 'password') => {
        const text = type === 'email' ? '邮箱' : '密码'
        if (!values || !values?.trim?.().length) {
            return Promise.reject(`请输入${text}`)
        }

        if (type === 'email' && values?.trim?.()?.length < 4) {
            return Promise.reject(`邮箱必须大于四位`)
        }

        if (type === 'password' && values?.trim?.()?.length < 6) {
            return Promise.reject(`密码必须大于六位`)
        }

        return Promise.resolve()
    }


    return <div className='loginWrapper'>
        <div className='login'>
            <Form {...formItemLayout} labelAlign={'left'} onFinish={onFinish} colon={false} form={form}  >
                <h2>Glad to see you</h2>
                <h4 className='h4'>Login to continue using Wholesale</h4>
                <Item name={'username'} label='Email' rules={[{ validator: (rules: any, values: any) => validate(values, 'email') }]}>
                    <Input placeholder='please enter your email' />
                </Item>
                <Item name={'password'} label={<div className='psd'>
                    <span>Password</span><Button className='contact' type='link'>Forgot your password?</Button>
                </div>} rules={[{ validator: (rules: any, values: any) => validate(values, 'password') }]}>
                    <Input.Password placeholder='please enter your Password' />
                </Item>
                <Item >
                    <Button htmlType='submit' loading={loading} className='btn' type='primary'>Login</Button>
                    <p>Having trouble logging in?<Button className='contact' type='link'>Contact us</Button> </p>
                </Item>
            </Form>
        </div>
    </div>
}

export default Login