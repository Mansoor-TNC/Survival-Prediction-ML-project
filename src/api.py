import joblib
import pandas as pd
from typing import Literal
from pydantic import BaseModel, Field
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Titanic Survival Prediction API")

app.add_middleware(CORSMiddleware,allow_origins=["http://localhost:5173","http://127.0.0.1:5173",],allow_credentials=True,allow_methods=["*"],allow_headers=["*"],)

model = joblib.load("models/knn_model.joblib")


class Passenger(BaseModel):
    pclass: int = Field(ge=1, le=3)
    fare: float = Field(gt=0)
    gender: Literal["male", "female"]
    age: float = Field(ge=0, le=100)


@app.get("/")
def home():
    return {"message": "Titanic Survival Prediction API is running"}


@app.post("/predict")
def predict(passenger: Passenger):

    if passenger.gender.lower() == "female":
        sex= 1
    elif passenger.gender.lower() == "male":
        sex = 0
    else:
        return {"error": "Gender must be male or female"}

    input_data = pd.DataFrame([[
        passenger.pclass,
        passenger.fare,
        sex,
        passenger.age
    ]])

    prediction = model.predict(input_data)[0]

    if prediction == 1:
        result = "Survived"
    else:
        result = "Not Survive"

    return {"prediction": result}