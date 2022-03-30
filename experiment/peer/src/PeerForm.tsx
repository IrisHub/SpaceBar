import SimplePeer from "simple-peer"; 
import React from 'react';

export function PeerForm(props: { peer: SimplePeer.Instance }) {
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        const data = (event.currentTarget.elements[0] as HTMLInputElement).value;
        console.log('Submitting form', data);
    } 

    return (
        <form onSubmit={(e)=>handleSubmit(e)}>
            <textarea id="incoming"></textarea>
            <button type="submit">submit</button>
        </form>
    );
}