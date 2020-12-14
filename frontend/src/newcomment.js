import React, { useState } from 'react';
import { Collapse, Button} from 'reactstrap';
import { connect } from 'react-redux';

const Newcomment = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  const handlesubmit=(event)=>{
    event.preventDefault();

      let url="https://zlic16.herokuapp.com/articles/"+props.article.pid;
      let payload={text:event.target.text.value, commentId:-1};
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
  

  return (
    <div>
      <Button color="secondary" onClick={toggle} style={{ marginBottom: '1rem' }}>Make Comment</Button>
      <Collapse isOpen={isOpen}>
            <form id={"newcomment"+props.article.pid} onSubmit={handlesubmit}>
                        <textarea name="text" placeholder="make new comment" rows="2" cols="60" required/>  
                        <br/>
                        <input className="btn btn-dark" type="submit" value="post"/>
                        &nbsp;&nbsp;
                        <input className="btn btn-dark" type="reset" value="clear"/>
            </form>
        
        {/*<Card>
          <CardBody>
          Anim pariatur cliche reprehenderit,
           enim eiusmod high life accusamus terry richardson ad squid. Nihil
           anim keffiyeh helvetica, craft beer labore wes anderson cred
           nesciunt sapiente ea proident.
          </CardBody>
        </Card>*/}

      </Collapse>
      <br/>
    </div>
  );
}

export default Newcomment;