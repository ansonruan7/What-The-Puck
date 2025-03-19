import sys
import json
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import warnings
warnings.filterwarnings("ignore", category=FutureWarning, message=".*_register_pytree_node.*")

# Load the saved model and tokenizer
model_path = "../saved_model"
tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForSequenceClassification.from_pretrained(model_path)
model.eval()

def predict(text):
    inputs = tokenizer(text, return_tensors="pt", padding="max_length", truncation=True, max_length=512)

    with torch.no_grad():
        outputs = model(**inputs)

    logits = outputs.logits
    probabilities = torch.nn.functional.softmax(logits, dim=-1)
    predicted_class = torch.argmax(probabilities, dim=-1).item()
    return {"input": text,"prediction": predicted_class}
    #return {"input": text, "prediction": predicted_class, "probabilities": probabilities.tolist()}

if __name__ == "__main__":
    text = sys.argv[1]
    print(json.dumps(predict(text)))