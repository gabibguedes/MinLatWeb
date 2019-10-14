import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Activity, minimum_lateness} from './MinLat';
import {Button, Card, Container, Col} from 'react-bootstrap';
import Forms from './components/Forms';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const defaultTime = {
  formatted12: "12:00 pm",
  formatted24: "12:00",
  formattedSimple: "12:00",
  hour: 12,
  hour12: 12,
  meridiem: "pm",
  minute: 0,
};

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      activities: [],
      answer: [],
      name: '',
      execTime : 0,
      deadline: defaultTime,
      showForm: false,
      idCount: 0,
      showResult: false
    };
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(e){    
    let field = e.target.name;
    let val = e.target.value;
    this.setState({[field]: val});
  }

  removeFromList(item){
    this.setState({showResult: false});
    console.log(item.name);
    let index = this.state.activities.findIndex(x => x.id === item.id);
    console.log(index);
    let copy_arr = this.state.activities;
    copy_arr.splice(index,1);

    this.setState({activities: copy_arr, answer: []})
  }

  addToList(){
    let new_activity = new Activity(this.state.name, 
                                    this.state.execTime, 
                                    this.state.deadline, 
                                    this.state.idCount);

    this.setState({idCount: this.state.idCount + 1});
    let copy_list = this.state.activities;
    copy_list.push(new_activity);
    this.setState({
                  activities:copy_list,
                  name: '',
                  execTime: 0,
                  deadline: defaultTime,
                  showResult: false,
                  showForm: false
                });
  }

  answer(){
    let result = minimum_lateness(this.state.activities);
    this.setState({answer: result})
    this.setState({showResult: true})
  }

  renderList(arr){
    if(arr.length > 0){
      return(
          arr.map((item) => (
            <Card key={item.id} style={{padding: '20px', marginBottom: '10px'}}>
              <Col>
              <Card.Title>{item.name}</Card.Title>
              <div style={styles.buttondiv}>
                <FontAwesomeIcon
                  icon={faTrash}
                  style={{ color: 'red', marginLeft: '10px' }}
                  onClick={() => this.removeFromList(item)}
                  />
                  </div>
                </Col>
              <Card.Text>
                Entrega: {item.deliveryTime.formatted12}<br/>
                Duração: {item.executionTime}h
              </Card.Text>
            </Card>
          ))
      )
    }else{
      return(
        <span>A lista está vazia :(</span>
      )
    }
  }

  render(){
    console.log(this.state.deadline);
    
    return(
      <Container>  
        <h1 style={{marginTop: '20px'}}>Minimo de Atraso</h1>

        <Forms
          show={this.state.showForm}
          name={this.state.name}
          execTime={this.state.execTime}
          handleChange={this.handleChange}
          deadline={this.state.deadline}
          changeTime={(newTime) => this.setState({ deadline: newTime })}
          addActivity={() => this.addToList()}
          cancel={() => this.setState({showForm: false})}
        />

        <Col>
        <div style={styles.buttondiv}>
        <Button
          style={styles.leftButton}
          onClick={() => this.setState({showForm: true})}>
            Adiciona na Lista de Atividades
        </Button>
        <Button
          onClick={() => this.answer()}
          style={styles.rightButton}>
            Roda o algoritimo
        </Button>
        </div>
        </Col>

        <hr/>

        {
          this.state.showResult?
          <div>
            <h2>Ordem de mínimo atraso:</h2>
            {this.renderList(this.state.answer)}
          </div>
          :
          <div>
            <h2>Lista de tarefas:</h2>
            {this.renderList(this.state.activities)}
          </div>
        }

      </Container>
  );
  }
}

const styles={
  leftButton: {
    marginRight: 10,
    fontSize: 15,
  },
  rightButton: {
    fontSize: 15,
  },
  buttondiv: {
    textAlign: 'right',
    position: 'relative',
  }
}

export default App;
