import joblib
import pandas as pd


model = joblib.load("models/knn_model.joblib")

pclass = int(input("Enter passenger class (1/2/3): "))
fare = float(input("Enter fare: "))
gender = input("Enter sex (male/female): ").lower()
age = float(input("Enter age: "))

if gender == "female":
    sex = 1
elif gender == "male":
    sex = 0
else:
    print("Invalid input. Please enter male or female.")
    exit()

passenger = pd.DataFrame({"pclass": [pclass], "fare": [fare], "sex": [sex], "age": [age]})

prediction = model.predict(passenger)[0]


if prediction == 1:
    print("Prediction: Survived")
else:
    print("Prediction: Did not survive")