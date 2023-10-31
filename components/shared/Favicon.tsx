'use client'

import React from 'react'
import { signOut, useSession } from "next-auth/react";
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect } from "react";

const Favicon = () => {

    const { data: session} = useSession();

    //wallet data
    const { publicKey, connected } = useWallet();
    const owner = publicKey ? publicKey.toBase58() : '';

    useEffect(() => {

        let color: string;

        if (!session || !connected || owner != session.user?.name) {
            color = 'red';
        } else {
            color = 'green';
        }

        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;

        const ctx = canvas.getContext('2d');

        if (ctx) {
            const img = new Image();

            img.onload = function () {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                ctx.lineWidth = 0; 
                ctx.imageSmoothingEnabled = true;

                ctx.fillStyle = color === 'red' ? '#FF0030' : '#50C878'; // Set color based on user sign-in status
                ctx.beginPath();
                ctx.arc(canvas.width - 7, canvas.height - 7, 8, 0, Math.PI * 2); // Smaller circle
                ctx.fill();

                ctx.fillStyle = '#FFFF0F'; 
                ctx.beginPath();
                ctx.arc(canvas.width - 7, canvas.height - 7, 3, 0, Math.PI * 2); // Smaller circle
                ctx.fill();

                const updatedFavicon = canvas.toDataURL('image/x-icon');
                const favicon = document.querySelector("link[rel*='icon']");
                if (favicon) {
                    favicon.setAttribute('href', updatedFavicon);
                } else {
                    console.error('Favicon link element not found');
                }
            };

            img.src = '/meta/favicon.ico';
        } else {
            console.error('Canvas or context is not supported');
        }

    }, [session, connected, owner])


    return (
        null
    )
}

export default Favicon