import React, { useState } from 'react';
import { Collapse, Button} from 'reactstrap';


const Editcomment = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);


  let placeholder=props.comment.comment;
  //let allow=true;

  if(props.comment.author!=props.currentUsername){
    placeholder="Only the author is allowed to edit this comment";
    //allow=false;
  }

  const handlesubmit=(event)=>{
    event.preventDefault();
    if(props.comment.author==props.currentUsername){
      let url="https://zlic16.herokuapp.com/articles/"+props.article.pid;
      let payload={text:event.target.text.value, commentId: props.comment.cid};
      console.log(url)
      console.log(payload)
      fetch(url, {
          method: 'PUT', 
          credentials: 'include', 
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload) 
        })
        .then(res => {
          res.json()
        .then(
          (result) => {
              window.location.reload(false);
          },
          (error) => {
              console.log(error);
          }
      )})
    }
    
  }

  return (
    <div>
      <Button color="secondary" onClick={toggle} style={{ marginBottom: '1rem' }}>edit</Button>
      <Collapse isOpen={isOpen}>
            <form id={"article"+props.article.pid+"comment"+props.comment.cid} onSubmit={handlesubmit}>
                        <textarea name="text" defaultValue={placeholder} rows="1" cols="60" required/>  
                        <br/>
                        <input className="btn btn-dark" type="submit" value="update"/>
            </form>

      </Collapse>
      <br/>
    </div>
  );
}

export default Editcomment;