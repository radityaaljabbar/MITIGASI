import sys
import json
import joblib
import numpy as np
import urllib.request
import os
import tempfile

def download_model():
    """Download model dari GCS public URL"""
    model_url = "https://storage.googleapis.com/model-random-forest/random_forest_model.pkl"
    model_path = os.path.join(tempfile.gettempdir(), 'random_forest_model.pkl')
    
    # Download hanya jika belum ada
    if not os.path.exists(model_path):
        try:
            print("Downloading model...", file=sys.stderr)
            urllib.request.urlretrieve(model_url, model_path)
            print(f"Model downloaded successfully!", file=sys.stderr)
        except Exception as e:
            print(f"Error downloading model: {e}", file=sys.stderr)
            return None
    
    return model_path

def decode_prediction(pred):
    """Convert prediction string ke lowercase"""
    pred_str = str(pred).lower()
    return pred_str

def predict_status(ipk, skor_psikologi, finansial):
    """Main prediction function"""
    try:
        # Download dan load model
        model_path = download_model()
        if not model_path:
            return {"success": False, "error": "Failed to download model"}
        
        model = joblib.load(model_path)
        
        # Convert inputs ke numeric
        ipk_val = float(ipk)
        skor_psikologi_val = float(skor_psikologi)
        finansial_val = int(finansial)
        
        # Validasi range input
        if not (0.0 <= ipk_val <= 4.0):
            return {"success": False, "error": "IPK must be between 0.0 and 4.0"}
        
        if not (0 <= skor_psikologi_val <= 100):
            return {"success": False, "error": "Skor psikologi must be between 0 and 100"}
            
        if finansial_val not in [0, 1]:
            return {"success": False, "error": "Finansial must be 0 or 1"}
        
        # Prepare input array - [IPK, Skor_Psikologi, Finansial]
        input_data = np.array([[ipk_val, skor_psikologi_val, finansial_val]])
        
        # Debug output
        print(f"Input: IPK={ipk_val}, Skor_Psikologi={skor_psikologi_val}, Finansial={finansial_val}", file=sys.stderr)
        
        # Prediksi
        prediction = model.predict(input_data)
        prediction_proba = model.predict_proba(input_data)
        
        # Debug output  
        print(f"Prediction: {prediction[0]}", file=sys.stderr)
        print(f"Classes: {model.classes_}", file=sys.stderr)
        
        # Get confidence
        confidence = float(np.max(prediction_proba) * 100)
        
        # Decode result
        predicted_status = decode_prediction(prediction[0])
        
        # Get detailed probabilities
        prob_details = {}
        for i, class_name in enumerate(model.classes_):
            prob_details[class_name.lower()] = round(float(prediction_proba[0][i]) * 100, 2)
        
        return {
            "success": True,
            "predicted_status": predicted_status,
            "confidence": round(confidence, 2),
            "probabilities": prob_details,
            "input_data": {
                "ipk": ipk_val,
                "skor_psikologi": skor_psikologi_val,
                "finansial": finansial_val
            }
        }
        
    except ValueError as e:
        return {
            "success": False,
            "error": f"Invalid input values: {str(e)}"
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

if __name__ == "__main__":
    # Baca input dari command line arguments
    if len(sys.argv) != 4:
        print(json.dumps({"success": False, "error": "Usage: python predict.py <ipk> <skor_psikologi> <finansial>"}))
        sys.exit(1)
    
    # Variable names yang benar sesuai input
    ipk = sys.argv[1]
    skor_psikologi = sys.argv[2] 
    finansial = sys.argv[3]
    
    # Jalankan prediksi
    result = predict_status(ipk, skor_psikologi, finansial)
    
    # Output JSON
    print(json.dumps(result))