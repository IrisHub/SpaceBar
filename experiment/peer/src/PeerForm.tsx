import SimplePeer from "simple-peer"; 
import { useLocation } from 'react-router-dom';
import React from 'react';


export function PeerForm(props: { peer: SimplePeer.Instance }) {
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        const data = (event.currentTarget.elements[0] as HTMLInputElement).value;
        // console.log('Submitting form', data);
        // Send an initial signal to the peer when the user clicks the submit button.
        props.peer.signal(JSON.parse(data));
    } 

    return (
        <form onSubmit={(e)=>handleSubmit(e)}>
            <textarea id="incoming"></textarea>
            <button type="submit">submit</button>
        </form>
    );
}