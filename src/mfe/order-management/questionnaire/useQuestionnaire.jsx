import React from 'react';

function useQuestionnaire() {
  const [questions, setQuestions] = React.useState([]);
  const addQuestion = () => {
    const newQuestion = {
      text: {
        en: '',
        es: ''
      }
    };
    questions.push(newQuestion);
    setQuestions([...questions]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.splice(index, 1));
  };

  const changeQuestionType = (index, type) => {
    const currentQuestion = questions[index];
    currentQuestion.type = type;
    __addInitialOption__(currentQuestion, type);

    setQuestions([...questions]);
  };

  const changeQuestionText = (index, value) => {
    const currentQuestion = questions[index];
    currentQuestion.text.en = value;

    setQuestions([...questions]);
  };

  const applyChecks = (index, check) => {
    const currentQuestion = questions[index];
    currentQuestion[check] = !currentQuestion[check];

    setQuestions([...questions]);
  };

  const addOption = (index, type) => {
    const currentQuestion = questions[index];
    if (!currentQuestion.options) {
      __addInitialOption__(currentQuestion, type);
    } else {
      currentQuestion.options.push({
        label: {
          en: '',
          es: ''
        },
        value: ''
      });
    }

    setQuestions([...questions]);
  };

  const removeOption = (index, optionIndex) => {
    const currentQuestion = questions[index];
    currentQuestion.options.splice(optionIndex, 1);

    setQuestions([...questions]);
  };

  const updateOption = (index, optionIndex, value) => {
    const currentQuestion = questions[index];
    const currentOptions = currentQuestion.options[optionIndex];
    if (currentOptions) {
      currentOptions.label.en = value;
      setQuestions(questions);
    }
  };

  const __addInitialOption__ = (question, type) => {
    if (['radioButton', 'dropdown'].includes(type)) {
      question.options = [
        {
          label: {
            en: '',
            es: ''
          },
          value: ''
        }
      ];
      if (type === 'radioButton') {
        question.options.push({
          label: {
            en: '',
            es: ''
          },
          value: ''
        });
      }
    }
  };

  return {
    questions,
    addQuestion,
    removeQuestion,
    changeQuestionType,
    changeQuestionText,
    applyChecks,
    addOption,
    removeOption,
    updateOption
  };
}

export default useQuestionnaire;
