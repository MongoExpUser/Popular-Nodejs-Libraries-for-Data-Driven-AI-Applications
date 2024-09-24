/********************************************************************************************************************************
* classify-review-embed-free.mjs                                                                       			        *                            
*                                                                                                                		*
* Project:  Text and Image App (classify, review and embed) with Nodejs GenAI free libraries.                                    *
*                                                                             							*
*  Copyright © 2024. MongoExpUser.  All Rights Reserved.                                 					*
*                                                                                     						*
*  License: MIT - https://github.com/MongoExpUser/Popular-Nodejs-Libraries-for-Data-Driven-AI-Applications/blob/main/LICENSE    *
*                                                                                                            			*
********************************************************************************************************************************/

//
import { Image } from "image-js";
import { inspect } from "node:util";
import { readFileSync } from "node:fs";
import * as tf from "@tensorflow/tfjs-node";
import { pipeline } from '@xenova/transformers';
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as encoder from "@tensorflow-models/universal-sentence-encoder";

// classify-review-and-embed-free.js

class AIApp
{
	        constructor()
	        {
	      	   return null;
	        }
	
	        async prettyPrint(value)
	        {
		   console.log(inspect(value, { showHidden: false, colors: true, depth: Infinity }));
	        }

		async separator()
		{
		   console.log(`------------------------------------------------------------------------`);
		}

		async classifyText(texts)
		{
		    console.log("");
		    console.log("-- Classify Text with Transformer.js --");

		    const classifierResults = [];
		    const textLen  = texts.length;
		    const classifier = "Xenova/distilbert-base-uncased-finetuned-sst-2-english";
		    const cpl = await pipeline("sentiment-analysis", classifier);

		    for(let index = 0; index < textLen; index++)
		    {
		        const text = texts[index];
			const cplResult = await cpl(text);
		        classifierResults.push(cplResult);
		    }

		    return classifierResults;
		}

		async reviewText(texts)
		{
		    console.log("");
		    console.log("-- Review Text with Transformer.js --");

		    const reviewerResults = [];
		    const textLen  = texts.length;
		    const reviewer  = "Xenova/bert-base-multilingual-uncased-sentiment";
		    const rpl = await pipeline("sentiment-analysis", reviewer);

		    for(let index = 0; index < textLen; index++)
		    {
		        const text = texts[index];
			const rplResult = await rpl(text);
		        reviewerResults.push(rplResult);
		    }

		    return reviewerResults;
		}

		async generateImageEmbeddingsWithTensorFlowMobilenet(files)
		{
		    console.log("");
		    console.log("-- Generate Image Embeddings with TensorFlow.js - Mobilenet Model- -");

		    const embeddings = []
		    const fileLen  = files.length;

		    for(let index = 0; index < fileLen; index++)
		    {
		        const file = files[index];
		        const image = await Image.load(file);
		        const model = await mobilenet.load(); 
		        const getEmbedding = await model.infer(image);
		        const embed = getEmbedding .arraySync()[0];
		        embeddings.push(embed);
		    }

		    return embeddings;
		}

		async generateImageEmbeddingsWithTensorFlowUse(files)
		{
		    console.log("");
		    console.log("-- Generate Image Embeddings with TensorFlow.js - Use (universal-sentence-encoder) Model --");

		    const embeddings = []
		    const fileLen  = files.length;

		    for(let index = 0; index < fileLen; index++)
		    {
		        const file = files[index];
		        const image = file; 
		        const model = await encoder.load();
		        const getEmbedding  = await model.embed(image);
		        const embed = getEmbedding .arraySync()[0];
		        embeddings.push(embed);
		    }

		    return embeddings;
		}

		async generateImageEmbeddingsWithTransformer(files)
		{
		    console.log("");
		    console.log("-- Generating Image Embeddings with Transformer.js --");

		    const embeddings = []
		    const fileLen  = files.length;
		    const imageFeatureExtractorModel = "Xenova/vit-base-patch16-224-in21k";
		    const ifepl = await pipeline("image-feature-extraction", imageFeatureExtractorModel);

		    for(let index = 0; index < fileLen; index++)
		    {
		        const file = files[index];
		        const image = file; 
		        const embed = await ifepl(image);
		        embeddings.push(embed)
		    }

		    return embeddings;
		}

		async generateTextEmbeddingsWithTransformer(texts)
		{
		    console.log("");
		    console.log("-- Generating Text Embeddings with Transformer.js --");

		    const embeddings = []
		    const textLen  = texts.length;
		    const textFeatureExtractor = "Xenova/all-MiniLM-L6-v2";
		    const tfepl = await pipeline("feature-extraction", textFeatureExtractor);

		    for(let index = 0; index < textLen; index++)
		    {
		        const text = texts[index];
		        const embed = await tfepl(text, { pooling: 'mean', normalize: true });
		        embeddings.push(embed)
		    }

		    return embeddings;
		}

		async testAIApp()
		{
		    const aiapp = new AIApp();
      
		    const imageFilesToEmbed = [
		    	"nodejs-logo.png",
		    	"python-logo.png",
		    	"rust-logo.png"
		    ];
      
		    const textsToReview = [
		    	"The location is very far.", 
		    	"The hotel is okay."
		    ];
      
		    const textsToClassify = [
		    	"Feeling happy today.", 
		    	"Last game was very difficult.", 
		    	"The support provided is excellent."
		    ]
      
		    const textsToEmbed = ["The project is going as planned."]

		    // 1. text sa-review with transformer.js
		    const textReviewTr  = await aiapp.reviewText(textsToReview);
		    await prettyPrint( { "textReviewTransformer" : textReviewTr } );

		    // 2. text sa-classification with transformer.js
		    const textClassifyTr  = await aiapp.classifyText(textsToClassify);
		    await prettyPrint( { "textClassifierTransformer" : textClassifyTr } );

		    // 3. image embedding with tensorflow.js
		    // a. mobilenet
		    const imageEmbeddingsTfMob = await aiapp.generateImageEmbeddingsWithTensorFlowMobilenet(imageFilesToEmbed);
		    await prettyPrint( { "imageEmbeddingTensorFlowMob" : imageEmbeddingsTfMob } );

		    // b. use - universal sentense encoder
		    const imageEmbeddingsTfUse = await aiapp.generateImageEmbeddingsWithTensorFlowUse(imageFilesToEmbed);
		    await prettyPrint( { "imageEmbeddingTensorFlowuse" : imageEmbeddingsTfUse } );

		    // 4. image embedding with transformer.js
		    const imageEmbeddingsTr = await aiapp.generateImageEmbeddingsWithTransformer(imageFilesToEmbed);
		    await prettyPrint( { "imageEmbeddingTransformer" : imageEmbeddingsTr} );

		    // 5. text embedding with transformer.js
		    const textEmbeddingsTr  = await aiapp.generateTextEmbeddingsWithTransformer(textsToEmbed);
		    await prettyPrint( { "textEmbeddingTransformer" : textEmbeddingsTr } );
		}
}


const aiapp = new AIApp();
await aiapp.testAIApp();
