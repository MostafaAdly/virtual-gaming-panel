import React, { Component, useEffect, useState } from "react";

const index = ()=>{
    const [logs, setLogs] = useState([]);
    
        useEffect(() => {
            console.log('test')
        }, [])

        return ( 
            <>
            <link rel="stylesheet" type="text/css" href="./assets/css/style.css" />

            <menu>
        <nav>

            <div className="menu">
                <div className="logos">
                    <a className="links" href="/"><img src='./assets/img/LogoPNG.png' alt="" className="logo"></img></a>
                </div>
                <div className="menu-a">
                                <button className="links" onClick={() => { console.log('clicked')}}>{logs.length ? logs : "home"}</button>
                </div>
                <div className="menu-a">
                    <a className="links" href="/">Console</a>
                </div>
                <div className="menu-a">
                    <a className="links" href="/">Log</a>
                </div>
                <div className="menu-a">
                    <a className="links" href="/">Folders</a>
                </div>
                <div className="menu-a">
                    <a className="links" href="/">MySQL</a>
                </div>
                <div className="menu-a">
                    <a className="links" href="/">Settings</a>
                </div>

            </div>

            <header className="title">
                <h1>Console Frame</h1>
            </header>

            <div className="frame">
                <div className="console">
                    <h1 className="top-console">Console Title</h1>

                                
                                {
                                    logs?.forEach(log => (
                                        <h1>{ log}</h1> 
                                    ))

                    }

                    {/* {{> console}}
                    {{!-- {{#each console}}
                    <h1 style="text-align:left;">{{this}}</h1>
                    {{/each}} --}} */}

                                <input className="fot-console"></input>
                    <br />

                </div>
                <div className="status">
                    <h1>CPU Status</h1>
                </div>
            </div>


        </nav>
    </menu>
            
            </>
         );
}
    
export default index;
 