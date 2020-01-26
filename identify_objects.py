'''
Object Detection Script

Usage --> python identify_objects.py # --input-path --output-path --model-name --model-path
Usage (mac) --> python3 identify_objects.py
'''
# Imports
import numpy as np
import os
import six.moves.urllib as urllib
import sys
import tarfile
import tensorflow as tf
import zipfile
import cv2
import json

from collections import defaultdict
from io import StringIO
from matplotlib import pyplot as plt
from PIL import Image
from pymongo import MongoClient

from custom_utils import visualization_utils as cus_vis_util
sys.path.append("./tensorflow/models/research/object_detection")
from object_detection.utils import ops as utils_ops
from utils import label_map_util


# Get Model Info - Should change to command line args
MODEL_NAME = 'ssd_inception_v2_coco_2018_01_28'
MODEL_FILE = MODEL_NAME + '.tar.gz'
MODEL_PATH = './'
PATH_TO_CKPT = MODEL_NAME + '/frozen_inference_graph.pb'
PATH_TO_LABELS = os.path.join('./tensorflow/models/research/object_detection/data/mscoco_label_map.pbtxt')
NUM_CLASSES = 90

def extract_model(model):
    tar_file = tarfile.open(model)
    for file in tar_file.getmembers():
        file_name = os.path.basename(file.name)
        if 'frozen_inference_graph.pb' in file_name:
            tar_file.extract(file, os.getcwd())

def make_detection_graph(ckpt):
    detection_graph = tf.Graph()
    with detection_graph.as_default():
        od_graph_def = tf.GraphDef()
        with tf.gfile.GFile(ckpt, 'rb') as fid:
            serialized_graph = fid.read()
            od_graph_def.ParseFromString(serialized_graph)
            tf.import_graph_def(od_graph_def, name='')
    return detection_graph

def detection(detection_graph, cap, category_index, output, threshold):
    x=0

    #data to write to mongodb atlas database
    data = {}

    client = MongoClient("mongodb+srv://catherine:deltahacks@cluster0-gywvq.gcp.mongodb.net/test?ssl_cert_reqs=CERT_NONE")
    db = client.get_database('frames_db')
    info = db.frames
    info.count_documents({})


    with detection_graph.as_default():
      with tf.Session(graph=detection_graph) as sess:
        reset = 0
        while True:
            
            ret, frame = cap.read()
            # Expand dimensions since the model expects images to have shape: [1, None, None, 3]
            frame_expanded = np.expand_dims(frame, axis=0)
            image_tensor = detection_graph.get_tensor_by_name('image_tensor:0')
            # Each box represents a part of the image where a particular object was detected.
            boxes = detection_graph.get_tensor_by_name('detection_boxes:0')
            # Each score represent how level of confidence for each of the objects.
            # Score is shown on the result image, together with the class label.
            scores = detection_graph.get_tensor_by_name('detection_scores:0')
            classes = []
            classes = detection_graph.get_tensor_by_name('detection_classes:0')
            num_detections = detection_graph.get_tensor_by_name('num_detections:0')
            # Actual detection.
            (boxes, scores, classes, num_detections) = sess.run(
              [boxes, scores, classes, num_detections],
              feed_dict={image_tensor: frame_expanded})

            # Visualization of the results of a detection.
            counter, csv_line, counting_mode = cus_vis_util.visualize_boxes_and_labels_on_image_array(cap.get(1),
                        frame,
                        1,
                        0,
                        np.squeeze(boxes),
                        np.squeeze(classes).astype(np.int32),
                        np.squeeze(scores),
                        category_index,
                        use_normalized_coordinates=True,
                        min_score_thresh=threshold,
                        line_thickness=4)




            print ("writing frame ", x, "\n--------------------------------------------------------------")

            x+=1
            filename = "image{:02d}.jpg".format(x)

            print(classes[0][0])

            sorted_category = ""

            if (classes[0][0] == 44.0 or classes[0][0] == 47.0): #bottle or cup
                sorted_category = 'recycle'
            elif (classes[0][0] == 77.0): #cell phone
                sorted_category = 'electronic waste'
            elif (classes[0][0] == 53.0 or classes[0][0] == 52.0): #apple
                sorted_category = 'compost'
            else:
                sorted_category = 'garbage'

            
            data = {
                'scores': str(scores[0]),
                'detections': str(num_detections),
                #'classes': str(counting_mode)
                'classes': sorted_category
                }
            

            output.write(frame)

            print(counting_mode)
            print(sorted_category)

            cv2.imwrite(("./output/static/lastFrame" + str(reset) + ".jpg"), frame)

            if reset >= 50:
                reset = 0
            else:
                reset+=1

            #inserts data into mongodb atlas
            info.insert_one(data)
            
            # Display the resulting frame
            cv2.imshow('video', frame)

            if cv2.waitKey(1) == 27:
                break #esc key to escape

        cap.release()
        cv2.destroyAllWindows()

def main():
    cap = cv2.VideoCapture(0) #1 for 2nd webcam, 0 for primary webcam

    width = int(cap.get(3))
    height = int(cap.get(4))
    fps = int(cap.get(5))

    #data to write to json
    data = {
        'scores': '0',
        'detections': '0',
        'classes': '0'
        }

    client = MongoClient("mongodb+srv://catherine:deltahacks@cluster0-gywvq.gcp.mongodb.net/test?ssl_cert_reqs=CERT_NONE")
    db = client.get_database('frames_db')
    info = db.frames
    info.count_documents({})


    fourcc = cv2.VideoWriter_fourcc(*'XVID')
    output = cv2.VideoWriter('./output/output.avi', fourcc, fps, (width, height))

    threshold = 0.5

    extract_model(MODEL_PATH + MODEL_FILE)
    detection_graph = make_detection_graph(PATH_TO_CKPT)


    #Load all the labels
    label_map = label_map_util.load_labelmap(PATH_TO_LABELS)
    categories = label_map_util.convert_label_map_to_categories(label_map, max_num_classes=NUM_CLASSES, use_display_name=True)
    category_index = label_map_util.create_category_index(categories)
    detection(detection_graph, cap, category_index, output, threshold)

if __name__ == '__main__':
    main()

