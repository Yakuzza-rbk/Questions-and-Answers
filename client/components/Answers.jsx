import axios from "axios";
import TOKEN from "../../server/apiService/config";
export default class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      questions_Answers: [],
      value: "",
    };
  }

  componentDidMount() {
    axios
      .get(`/api/qa/11001`)
      .then((res) => {
        console.log(res.data);
        this.setState({ questions_Answers: res.data.results });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    return (
      <div className="container row" style={{ display: "revert" }}>
        <div>
          <p className="Q_A_Title">QUESTIONS & ANSWERS</p>
          <input
            className="searchBarQuests"
            type="text"
            placeholder="HAVE A QUESTION? SEARCH FOR ANSWERS..."
            title="Type in a name"
            onChange={(e) => {
              this.setState({ value: e.target.value.toLowerCase() });
            }}
          />
          <div className="searchDiv">
            {this.state.value.length >= 3 ? (
              <ul>
                {this.state.questions_Answers
                  .filter((questions) =>
                    questions.question_body
                      .toLowerCase()
                      .includes(this.state.value)
                  )
                  .map((question) => (
                    <div key={question.question_id} className="hover-li">
                      <a>
                        <strong type="button">{question.question_body}</strong>
                      </a>
                    </div>
                  ))}
              </ul>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    );
  }
}
