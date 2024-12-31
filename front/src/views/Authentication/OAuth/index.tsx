import React, { useEffect } from 'react'
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';

export default function OAuth() {

    const { token, expirationTime } = useParams();
    const [cookie, setCookie] = useCookies();
    const navigate = useNavigate();

    useEffect(() => {

        if(!token || !expirationTime) return;

        const now = (new Date().getTime()) * 1000;
        const expires = new Date(now + Number(expirationTime)); // expirationTime이 String으로 넘어옴으로 Number로 강제변환 해줘야한다.

        setCookie('accessToken', token, { expires, path:'/' });
        navigate('/main');

    }, [token]);

    return (
        <></>
    )
}
