import React, { useEffect, useState } from "react";
import ScrollAnimation from 'react-animate-on-scroll';
import "animate.css";
import './posts.css';
import Scissors from '../img/scisors.gif' 

function Posts() {
    const [posts, setPosts] = useState([]);
    
    const getPosts = async () => {
      //in get posts
      console.log("in get post")
      const resp = await fetch(
        "https://my-worker.yurichen.workers.dev", {method:'GET'}
      )
      const postsResp = await resp.json();
      var converting = Object.entries(postsResp)[0][1]
      //add postid to the array of objects
      for(let i=0; i<converting.length; i++){
        let obj=converting[i]
        obj["id"]=i
        converting[i]=obj
      }
      setPosts(converting);
    };
    
    useEffect(() => {
      getPosts();
      console.log("this happens 1")
    }, [setPosts]);

    const handleSubmit=(e)=>{
      e.preventDefault();
      const formData=new FormData(e.target);
      const body={};
      formData.forEach((value, property) => body[property] = value);
      //clear form
      clearform();
      image();
      //object send to api
      const postOptions={
          method:'POST',
          headers:{'Content-Type':'application/json'},
          mode:'no-cors',
          body: JSON.stringify(body)
      };
      //posting
      //rerender by calling getposts that calls setposts
      fetch("https://my-worker.yurichen.workers.dev", postOptions)
          .then(response=>response.status)
          .then(getPosts)
          .catch(error=>{
              console.error('there was error with post', error);
          });
      
    }
    //clear form function
    function clearform(){
      document.getElementById("create-snip-form").reset();
    }
    //play animated gif
    function image(){
      document.getElementById("scissors").src=Scissors;
    }

    return (
      <div className="outerDiv">
        <div className="relative">
          <div className="main-title">Snipits</div>
          <div>
            <img id="scissors" className="img" src = {Scissors} alt="scissors snipping"></img>
          </div>
        </div>
        <div className="submission-form">
          <div className="subtitle">Create a snip!</div>
          <form onSubmit={handleSubmit} id="create-snip-form">
            <input maxlength="30" className="small-input" name="username" type="text" placeholder="name" defaultValue="" required />
            <input maxlength="50" className="small-input" name="title" type="text" placeholder="title" defaultValue="" required />
            <textarea maxlength="315" className="large-input" name="content" type="text" placeholder="what do you want to say?" defaultValue="" required />
            <button className="submit-button" type="submit">submit</button>
          </form>
        </div>
          {posts.slice(0).reverse().map((post) => (
            <div key={post.id} className="postDiv">
              <ScrollAnimation duration={.5} animateIn="animate__animated animate__fadeIn" >
                <div className="content">
                  <div className="name">
                    {post.username}
                  </div>
                  <div className="title">
                    {post.title}
                  </div>
                  <div className="context">
                    {post.content}
                  </div>
                </div>
              </ScrollAnimation>
            </div>
          ))}
      </div>
    );
  };
  
  export default Posts;