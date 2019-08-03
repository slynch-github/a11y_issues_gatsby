import React from "react"
import Layout from "../components/layout"
import { graphql } from "gatsby"
import { Button } from "react-bootstrap"
import "bootstrap/dist/css/bootstrap.css"

class AllIssues extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      notes: "",
      priority: "",
      wc_criterion: "",
      issueList: [],
      myButtons: "",
      currentList: [],
      issue: {}
    }

    this.handleChange = this.handleChange.bind(this)
    this.addIssue = this.addIssue.bind(this)
    this.filter = this.filter.bind(this)
    this.viewAll = this.viewAll.bind(this)
  }

  componentDidMount() {
    let myButtonList = {}
    this.props.data.allNodeIssue.edges.forEach(elem => {
      if (!(elem.node.field_area_of_concern in myButtonList)) {
        myButtonList[elem.node.field_area_of_concern] = [elem.node]
      } else {
        myButtonList[elem.node.field_area_of_concern].push(elem.node)
      }
    })
    let newArray = []
    for (let key in myButtonList) {
      for (let i = 0; i < myButtonList[key].length; i++) {
        let currentElem = myButtonList[key][i]
        newArray.push(currentElem)
      }
    }
    this.setState({ currentList: newArray, myButtons: myButtonList })
  }

  filter(evt) {
    this.setState({ currentList: this.state.myButtons[evt.target.value] })
  }

  viewAll() {
    let newArray = []
    for (let key in this.state.myButtons) {
      for (let i = 0; i < this.state.myButtons[key].length; i++) {
        let currentElem = this.state.myButtons[key][i]
        newArray.push(currentElem)
      }
    }
    this.setState({ currentList: newArray })
  }

  handleChange(evt) {
    const name = evt.target.name
    const value = evt.target.value
    this.setState({ [name]: value })
  }
  addIssue(evt) {
    evt.preventDefault()
    this.state.issueList.push({
      wc_criterion: evt.target.value,
      notes: this.state.notes,
      priority: this.state.priority,
    })
    this.setState({ wc_criterion: "", notes: "", priority: "" })
  }

  render() {
    const { data } = this.props
    console.log("data count", data.allNodeIssue.edges.length)
   
    return (
      <div className="wrapper">
        <div className="main">
          <Layout>
      
            <div className="buttonFilters">
              <Button
                size="sm"
                variant="light"
                onClick={this.viewAll}
                type="submit"
              >
                View All
              </Button>
              {this.state.myButtons
                ? Object.keys(this.state.myButtons).map((key, index) => (
                    <span key={index}>
                      <Button
                        size="sm"
                        variant="light"
                        onClick={this.filter}
                        value={key}
                        type="submit"
                      >
                        {key}
                      </Button>
                    </span>
                  ))
                : null}
            </div>

            <form>
              <div className="issue">




                
      {this.state.currentList.map((elem, index) => {
        let notes, priority
        
              return (
                  <div key={index}>
                    <div>Area of Concern: {elem.field_area_of_concern}</div>
                    {/* <input
                      type="checkbox"
                      id="issue"
                      name="wc_criterion"
                      value={elem.field_wc}
                      onChange={this.handleChange}
                    />
                    <label htmlFor="issue">Issue: {elem.field_issue}</label> */}
                    Issue: {elem.field_issue}
                    <div>WCAG Criterion: {elem.field_wc}</div>
                    <div>
                      <a href={elem.field_understanding_link}>
                        Understanding the Criterion
                      </a>
                    </div>
                    <label htmlFor="priority">Priority: </label>
                    <input
                      type="text"
                      id="priority"
                      name="priority"
                      placeholder={elem.field_default_priority}
                      value={priority}
                      onChange={this.handleChange}
                    />
                    <br />
                    <div>Default notes: {elem.field_default_notes}</div>
                    <label htmlFor="notes">My Notes: </label>
                    <textarea
                      rows="10"
                      cols="50"
                      id="notes"
                      name="notes"
                      value={notes}
                      onChange={this.handleChange}
                    />
                    <button value={elem.field_wc} onClick={this.addIssue} type="submit">
                      Add Issue to Report
                    </button>
                  </div>
                )}
      )}
              </div>{" "}
            </form>
          </Layout>
        </div>

        <div className="sidebar">
          <table className="sopretty">
            <thead>
              <tr>
                <th>#</th>
                <th>WCAG Criterion</th>
                <th>Description</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {this.state.issueList.map((elem, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{elem.wc_criterion}</td>
                  <td>{elem.notes}</td>
                  <td>{elem.priority}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        


      </div>
    )
  }
}
export default AllIssues

export const query = graphql`
  query allNodeIssue {
    allNodeIssue {
      edges {
        node {
          field_issue
          field_default_priority
          field_default_notes
          field_area_of_concern
          field_wc
          field_understanding_link
        }
      }
    }
  }
`
