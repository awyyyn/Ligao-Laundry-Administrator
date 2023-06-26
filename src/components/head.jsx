import Head from 'next/head'
import React from 'react'

export default function CustomHead({title}) {
    return (
        <Head>
            <link rel='icon' href='/images/icon.webp' />
            <title>{title}</title>
        </Head>
    )
}
