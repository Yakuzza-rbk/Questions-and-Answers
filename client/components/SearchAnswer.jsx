import axios from "axios";

import moment from "moment";
import { TOKEN } from "../../server/apiService/config";

export default class QA extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      product_id: 11050,
      QandA: [],
      ///////////////
      displayed_quests: 2,
      displayed_answers: 2,
      /////////////

      likeAnswers: [],
      /////////////
      authoAdd_Q: true,
      body_Q: "",
      name_Q: "",
      email_Q: "",
      /////////////
      AddAns: true,
      body_A: "",
      name_Q: "",
      email_A: "",
      imag_A: "",
    };

    this.incHelpful = this.incHelpful.bind(this);
    this.updateQuestion_Reported = this.updateQuestion_Reported.bind(this);
    this.addQ = this.addQ.bind(this);
    this.addA = this.addA.bind(this);
  }

  componentDidMount() {
    axios
      .get(`/api/qa/${11050}`)
      .then((res) => {
        var data = res.data.results;
        console.log({ data });
        this.setState({
          QandA: data.sort(
            (a, b) => b.question_helpfulness - a.question_helpfulness
          ),
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  incHelpful(answer_id, like_A, index_Q) {
    if (!this.state.likeAnswers[answer_id]) {
      const answersArray = this.state.QandA;
      answersArray[index_Q].answers[answer_id].helpfulness = like_A;
      this.state.likeAnswers[answer_id] = true;
      console.log(like_A, answer_id);
      axios
        .put(`/api/qa/${answer_id}/updatehelp`, like_A
        )
        .then((res) => {
          
          this.setState({ QandA: answersArray });
        })
        .catch((err) => console.log(err));
    }
  }

  updateQuestion_Reported(question_id, report, index) {
    const array_R = this.state.QandA;
    array_R[index].reported = report;
    console.log(question_id, report, index);
    axios
      .put(
        `https://app-hrsei-api.herokuapp.com/api/fec2/hrnyc/qa/questions/${question_id}/report`,
        report,
        { headers: { Authorization: `${TOKEN}` } }
      )
      .then((res) => {
        console.log("question_reported", res);
        this.setState({ QandA: array_R });
      })
      .catch((err) => console.log(err));
  }

  addQ(e) {
    e.preventDefault();
    const { body_Q, name_Q, email_Q, product_id } = this.state;
    axios.post(`api/qa/questions/${11050}` , {
      body: body_Q, name: name_Q, email: email_Q, product_id: product_id
    })
      .then((res) => {
        console.log("Post Question", res);
        this.setState({ authoAdd_Q: !this.state.authoAdd_Q });
      })
      .catch((err) => console.log(err));
  }

  addA(e, question_id) {
    e.preventDefault();
    const { body_A, name_A, email_A, imag_A } = this.state;
    console.log(question_id, body_A, name_A, email_A, imag_A);
    axios
      .post(
        `https://app-hrsei-api.herokuapp.com/api/fec2/hrnyc/qa/questions/${question_id}/answers`,
        { body: body_A, name: name_A, email: email_A, imag_A },
        { headers: { Authorization: `${TOKEN}` } }
      )
      .then((res) => {
        console.log("Post Answer", res);
        this.setState({ AddAns: !this.state.AddAns });
      })
      .catch((err) => console.log(err));
  }

  render() {
    const questions = this.state.QandA.filter(
      (question, i) =>
        (i < this.state.displayed_quests) & (question.reported == false)
    );
    console.log(this.state);

    return (
      <div>
        {questions.map((question, index) => (
          <article className="row" key={question.question_id}>
            <div className="col-8">
              <strong>Q: {question.question_body}</strong>
              {Object.values(question.answers)
                .sort((a, b) => b.helpfulness - a.helpfulness)
                .filter((answers, i) => i < this.state.displayed_answers)
                .map((answer) => (
                  <div className="answersBody" key={answer.id}>
                    <p className="answersP">
                      <strong>A:</strong>
                      <small> {answer.body}</small>
                    </p>
                    {answer.photos.map((photo, i) => (
                      <img
                        className="pictureImg"
                        type="button"
                        key={i}
                        src={photo}
                      />
                    ))}
                    <pre className="answer_info">
                      <small>
                        by {answer.answerer_name},
                        {moment(answer.date).format("LL")} |{" "}
                        <strong>Helpful?</strong>{" "}
                        <u
                          type="button"
                          onClick={() =>
                            this.incHelpful(
                              answer.id,
                              answer.helpfulness + 1,
                              index
                            )
                          }>
                          <strong>Yes</strong>
                        </u>
                        ({answer.helpfulness}) |{" "}
                        <u
                          type="button"
                          onClick={() =>
                            this.updateQuestion_Reported(
                              question.question_id,
                              !question.reported,
                              index
                            )
                          }>
                          <strong>Report</strong>
                        </u>
                      </small>
                    </pre>
                  </div>
                  
                ))}
              <p className="more_answersB">
                <strong
                  type="button"
                  onClick={() =>
                    this.setState({
                      displayed_answers: this.state.displayed_answers + 2,
                    })
                  }>
                  LOAD MORE ANSWERS
                </strong>
              </p>
            </div>

            <div className="col-4 addAnswerForQuest">
              <pre>
                <small>
                  <strong>Helpful?</strong>{" "}
                  <u type="button" id={index}>
                    <strong>Yes</strong>
                  </u>
                  ({question.question_helpfulness}) |{" "}
                  <u
                    type="button"
                    onClick={() =>
                      this.setState({ AddAns: !this.state.AddAns })
                    }>
                    <strong>Add Answer</strong>
                  </u>
                </small>
              </pre>
            </div>
            {!this.state.AddAns ? (
              <div className="create container">
                <div className="create-editor container">
                  <form>
                    <input
                      className="create-input"
                      type="text"
                      placeholder="Enter your Name"
                      onChange={(e) => {
                        this.setState({ name_A: e.target.value });
                      }}
                    />
                    <input
                      className="create-input"
                      type="email"
                      placeholder="Enter your E-mail"
                      onChange={(e) => {
                        this.setState({ email_A: e.target.value });
                      }}
                    />
                    <input
                      className="create-input"
                      type="text"
                      placeholder="Image URL"
                      onChange={(e) => {
                        this.setState({ imag_A: e.target.value });
                      }}
                    />
                    <textarea
                      className="create-body-textarea"
                      placeholder="Answer Body"
                      onChange={(e) => {
                        this.setState({ body_A: e.target.value });
                      }}
                    />
                    <button
                      className="create-submit-button"
                      onClick={(e) =>
                        this.addA(e, question.question_id)
                      }>
                      <strong>POST ANSWER</strong>
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              ""
            )}
          </article>
        ))}
        {this.state.QandA.length - this.state.displayed_quests > 0 ? (
          <button
            className="all_Button"
            type="button"
            onClick={() =>
              this.setState({
                displayed_quests: this.state.displayed_quests + 2,
              })
            }>
            <strong>MORE ANSWERED QUESTION</strong>
          </button>
        ) : (
          <button
            className="all_Button"
            type="button"
            onClick={() =>
              this.setState({
                displayed_quests: 2,
              })
            }>
            <strong>LESS QUESTION</strong>
          </button>
        )}
        <button
          className="add_question_button"
          type="button"
          onClick={() => this.setState({ authoAdd_Q: !this.state.authoAdd_Q })}>
          <strong>ADD A QUESTION +</strong>
        </button>
        <div>
          {!this.state.authoAdd_Q ? (
            <div className="create container">
              <div className="create-editor container">
                <form>
                  <input
                    className="create-input"
                    type="text"
                    placeholder="Enter your Name"
                    onChange={(e) => {
                      this.setState({ name_Q: e.target.value });
                    }}></input>
                  <input
                    className="create-input"
                    type="email"
                    placeholder="Enter your E-mail"
                    onChange={(e) => {
                      this.setState({ email_Q: e.target.value });
                    }}></input>
                  <textarea
                    className="create-body-textarea"
                    placeholder="Question Body"
                    onChange={(e) => {
                      this.setState({ body_Q: e.target.value });
                    }}></textarea>
                  <button
                    className="create-submit-button"
                    onClick={(e) => this.addQ(e)}>
                    <strong>POST QUESTION</strong>
                  </button>
                </form>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}
