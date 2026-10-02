import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import KNeighborsClassifier
from sklearn.metrics import accuracy_score

df = pd.read_csv("data/titanic.csv")

features = df[["pclass", "fare", "sex", "age"]].copy()
target = df["survived"]

features["age"] = features["age"].fillna(features["age"].median())
features["sex"] = features["sex"].map({"male": 0, "female": 1})

x_train, x_test, y_train, y_test = train_test_split(features, target, test_size=0.2, random_state=42)

model = Pipeline([("scaler", StandardScaler()), ("knn", KNeighborsClassifier(n_neighbors=5))])

model.fit(x_train, y_train)
predictions = model.predict(x_test)

accuracy = accuracy_score(y_test, predictions) * 100

print("Test Acccuracy of KNN: ", accuracy)
joblib.dump(model, "models/knn_model.joblib")
print("Model saved to models/knn_model.joblib")