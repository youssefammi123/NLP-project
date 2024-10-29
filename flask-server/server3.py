from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize the Groq model
llm = "llama-3.1-70b-versatile"
model = ChatGroq(
    model_name=llm,
    temperature=0,
    groq_api_key='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'
)

def extract_skills_from_resume2(resume_text):
    prompt = f"""
    Extract the skills and technologies mentioned in the following CV:
    {resume_text}

    Provide a list of skills and technologies, separated by commas.
    """
    try:
        prompt_temp = PromptTemplate(input_variables=["resume_text"], template=prompt)
        chain = prompt_temp | model
        skills_raw = chain.invoke({'resume_text': resume_text}).content.strip()
        skills = [skill.strip() for skill in skills_raw.split(',') if skill.strip()]
        return skills
    except Exception as e:
        print(f"Error extracting skills: {e}")
        return []
def generate_questions_from_skill2(category, skill):
    prompt = f"""
    Generate 5 interview questions for the category {category} based on the skill: {skill}.

    Please provide the questions in the following format:
    Question: [question content]
    Difficulty: [question difficulty - Easy/Medium/Hard]
    Category: [question category]

    Ensure there is no extra formatting or symbols before the difficulty level or question content.
    """
    try:
        prompt_temp = PromptTemplate(input_variables=["category", "skill"], template=prompt)
        chain = prompt_temp | model
        questions_raw = chain.invoke({'skill': skill, 'category': category}).content.strip()
        questions = []
        question = None
        for line in questions_raw.split('\n'):
            if line.startswith("Question:"):
                question = line.replace("Question:", "").strip()
            elif line.startswith("Difficulty:"):
                difficulty = line.replace("Difficulty:", "").strip()
                if question:
                    questions.append({'text': question, 'difficulty': difficulty, 'category': category})
                    question = None
        return questions
    except Exception as e:
        print(f"Error generating questions: {e}")
        return []

@app.route('/generate-question', methods=['POST'])
def handle_generate_question():
    data = request.json
    resume_text = data.get('resume_text', '')
    category = data.get('category', 'Data Science')  # Default to 'Data Science' if not provided

    skills = extract_skills_from_resume2(resume_text)
    
    all_questions = []
    for skill in skills:
        questions = generate_questions_from_skill2(category, skill)
        all_questions.extend(questions)
    
    return jsonify({
        'skills': skills,
        'questions': all_questions
    })

if __name__ == '__main__':
    app.run(debug=True)
