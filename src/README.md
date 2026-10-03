# Titanic Survival Prediction

A complete machine learning project that takes Titanic passenger information and predicts whether the passenger survived.

The project started as a practical machine-learning experiment and was then converted into a reproducible ML application with model persistence and a FastAPI REST API.

## Project Goals

* Explore and understand the Titanic dataset
* Perform basic exploratory data analysis
* Prepare features for machine learning
* Compare multiple classification algorithms
* Evaluate models using cross-validation and a held-out test set
* Build a reproducible training pipeline
* Save the trained model
* Expose the model through a REST API

## Dataset

The project uses the Titanic dataset containing passenger information such as:

* Passenger class
* Sex
* Age
* Fare
* Number of siblings/spouses aboard
* Number of parents/children aboard

The target variable is:

* `survived` — `1` for survived and `0` for did not survive

## Machine Learning Experiment

The initial experiment explored relationships between passenger characteristics and survival.

Some notable observations included:

* Female passengers had substantially higher survival rates than male passengers in this dataset.
* Survival rates generally decreased from first class to third class.
* Age showed differences in survival rates across age groups.

These observations were then used to build classification models.

### Features Used

The final comparable model experiment used:

```text
pclass
fare
sex
age
```

Missing age values were replaced using the median age.

Sex was encoded as:

```text
male   → 0
female → 1
```

## Models Compared

The following classification algorithms were evaluated:

* Logistic Regression
* K-Nearest Neighbors (KNN)
* Decision Tree
* Random Forest

Five-fold cross-validation was used during model comparison.

| Model                   | CV Mean Accuracy |
| ----------------------- | ---------------: |
| Logistic Regression     |           79.07% |
| KNN (k=5)               |           80.47% |
| Decision Tree (depth=3) |           80.48% |
| Random Forest           |           80.76% |

A separate held-out test set was then used for the final evaluation.

| Model                   | Test Accuracy |
| ----------------------- | ------------: |
| Logistic Regression     |        80.45% |
| KNN (k=5)               |    **82.12%** |
| Decision Tree (depth=3) |        79.89% |
| Random Forest           |        79.89% |

The KNN model achieved the highest held-out test accuracy in this particular experiment, so it was carried forward into the application.

This result is specific to this dataset, feature set, split, and experiment and should not be interpreted as KNN being universally superior.

## ML Pipeline

The final training pipeline uses:

```text
Titanic CSV
     ↓
Feature selection
     ↓
Missing-value handling
     ↓
Train/test split
     ↓
StandardScaler
     ↓
KNN classifier
     ↓
Evaluation
     ↓
Saved model
```

The scaler and KNN model are saved together as a single scikit-learn `Pipeline`.

This ensures that the same preprocessing is applied when the model is later used for predictions.

## Project Structure

```text
titanic-survival-prediction/
│
├── data/
│   └── titanic.csv
│
├── models/
│   └── knn_model.joblib
│
├── src/
│   ├── train.py
│   ├── predict.py
│   └── api.py
│
├── notebooks/
│
├── .gitignore
├── requirements.txt
└── README.md
```

## Installation

Clone the repository and install the dependencies:

```bash
pip install -r requirements.txt
```

## Train the Model

From the project root:

```bash
python src/train.py
```

The script trains the model and saves it to:

```text
models/knn_model.joblib
```

## Make a Prediction from the Command Line

Run:

```bash
python src/predict.py
```

The program asks for:

```text
Passenger class
Fare
Sex
Age
```

It then loads the saved model and produces a prediction.

## Run the API

Start the FastAPI application:

```bash
uvicorn src.api:app --reload
```

The API will be available at:

```text
http://127.0.0.1:8000
```

### API Documentation

FastAPI automatically provides interactive Swagger documentation at:

```text
http://127.0.0.1:8000/docs
```

### Prediction Endpoint

```text
POST /predict
```

Example request:

```json
{
  "pclass": 1,
  "fare": 80,
  "sex": "female",
  "age": 25
}
```

Example response:

```json
{
  "prediction": "Survived"
}
```

The API also validates incoming values before passing them to the machine-learning model.

## Technologies Used

* Python
* Pandas
* NumPy
* Scikit-learn
* Joblib
* FastAPI
* Uvicorn
* Git
* GitHub

## What This Project Demonstrates

This project covers the complete basic ML workflow:

```text
Data
 ↓
Exploration
 ↓
Feature preparation
 ↓
Model training
 ↓
Model comparison
 ↓
Evaluation
 ↓
Model persistence
 ↓
Inference
 ↓
API deployment
```

It also demonstrates the transition from an exploratory notebook-based experiment to a structured Python ML project.

## Future Improvements

Possible future improvements include:

* More robust preprocessing pipelines
* Additional feature engineering
* Hyperparameter tuning
* Better API validation and error handling
* Automated testing
* Containerization with Docker
* Deployment to a cloud platform
* Monitoring model performance
