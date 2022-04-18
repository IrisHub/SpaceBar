import SimpleSignaler from './network/simple-signaler'
import React from 'react';
import Peer from "./Peer";

export function PeerForm(props: { signaler: SimpleSignaler }) {
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        const data = (event.currentTarget.elements[0] as HTMLInputElement).value;
        props.signaler.sendMessage(data);
        console.log('Submitting form', data);
    } 

    return (
        <form onSubmit={(e)=>handleSubmit(e)}>
            <textarea id="incoming"></textarea>
            <button type="submit">submit</button>
        </form>
    );
}