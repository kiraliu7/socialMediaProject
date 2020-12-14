import React, { useState } from 'react';
import { Collapse, Button} from 'reactstrap';
import { connect } from 'react-redux';

const Editarticle = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  let placeholder=props.article.text;
  //let allow=false;

  if(props.article.author!=props.currentUsername){
    placeholder="Only the author is allowed to edit this article";
  }

  const handlesubmit=(event)=>{
    event.preventDefault();
    if(props.article.author==props.currentUsername){
      let url="https://zlic16.herokuapp.com/articles/"+props.article.pid;
      let payload={text:event.target.text.value};
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
      <Button color="secondary" onClick={toggle} style={{ marginBottom: '1rem' }}>Edit Article</Button>
      <Collapse isOpen={isOpen}>
            <form id={"editarticle"+props.article.pid} onSubmit={handlesubmit} >
                        <textarea name="text" defaultValue={placeholder} rows="10" cols="60" required/>  
                        <br/>
                        <input className="btn btn-dark" type="submit" value="update"/>
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

export default Editarticle;