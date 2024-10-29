import time
from flask import Flask, request, jsonify
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate

app = Flask(__name__)

# Initialize the model outside of the endpoint to avoid reloading it on every request
llm = "llama-3.1-70b-versatile"
model = ChatGroq(model_name=llm, temperature=0, groq_api_key='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')

def retry_request(func, *args, **kwargs):
    max_retries = 3
    delay = 2  # Initial delay in seconds
    for attempt in range(max_retries):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            if attempt < max_retries - 1:
                time.sleep(delay)
                delay *= 2  # Exponential backoff
            else:
                raise e

@app.route('/generate-questions', methods=['POST'])
def generate_questions():
    data = request.json
    job_description = data.get('job_description')
    
    # Your existing prompt and model logic
    prompt = """Identify topics that can be used for interview questions based on this job description:

    {job_description}

    Please respect the following structure:
    [TOPIC_1, TOPIC_2, TOPIC_3]"""

    prompt_template = PromptTemplate(input_variables=["job_description"], template=prompt)
    chain = prompt_template | model

    try:
        # Generate topics from the job description
        content = retry_request(chain.invoke, {'job_description': job_description }).content.strip()
    except Exception as e:
        return jsonify({'error': str(e)}), 503

    topics = [topic.strip() for topic in content[content.index('[')+1:content.index(']')].split(',')]

    category = "Data Science"

    questions = []
    question_prompt = """
    Generate 5 questions for the category {category} Topic: {topic}

    Please keep the questions varied and don't maintain the same meaning.

    Please conform with the following structure:
    [question_content, difficulty_level]
    [question_content, difficulty_level]
    [question_content, difficulty_level]
    """

    question_prompt_template = PromptTemplate(input_variables=["category", "topic"], template=question_prompt)
    question_chain = question_prompt_template | model

    for topic in topics:
        try:
            questions_raw = retry_request(question_chain.invoke, {'topic': topic, 'category': category }).content.strip()
        except Exception as e:
            return jsonify({'error': str(e)}), 503
        
        # Process each question
        loc_questions = []
        for line in questions_raw.split('\n'):
            if '[' in line and ']' in line:
                try:
                    question_data = line[line.index('[')+1: line.index(']')].replace('"', '').split(',')
                    if len(question_data) == 2:  # Ensure both question and difficulty level are present
                        loc_questions.append(question_data)
                except ValueError:
                    continue  # Skip malformed questions
        
        questions += loc_questions

    return jsonify({'questions': questions})

if __name__ == '__main__':
    app.run(debug=True)
