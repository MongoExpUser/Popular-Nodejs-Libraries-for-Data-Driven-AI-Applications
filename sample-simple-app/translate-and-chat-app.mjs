/*********************************************************************************************************************************
* translate-and-chat-app.js                                                                                                      *         			 *
* 																 *
* Project:  Translations and Chats App with Nodejs Fetch API                                            			 *
*                                                                                                              			 *
*  Copyright © 2024. MongoExpUser.  All Rights Reserved.                                                       			 *
*                                                                                                              			 *
*  License: MIT - https://github.com/MongoExpUser/Popular-Nodejs-Libraries-for-Data-Driven-AI-Applications/blob/main/LICENSE     *
*                                                                                                                     		 *
*                                                                                                                     		 *
**********************************************************************************************************************************/

/*
   Note 1: The use of Fetch API has the  following advantages:
    - You only have to deal with consistent arguments when  passing in arguments. These include:
      - endpoint or url
      - options:  method, headers and body (factor each providers' model to the body)
    - Irrespective of the providers' model you are calling, just create the above input endpoint and options and pass as arugment
      i.e. use consistent sets of arguments directly within your applications.
  Note 2: You still have to extract the response of providers's model based on the output object.
*/



import { inspect } from "node:util";
import { readFileSync } from "node:fs";


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

	async translationModel(text, sourceLanguage, targetLanguage, model, contentType, apiTokenOrKey, accountId)
	{
		const body =  JSON.stringify({  "text": text, "source_lang" : sourceLanguage.toLowerCase(), "target_lang":  targetLanguage.toLowerCase() });
		const endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`;
		const method = "POST";
		const authen = `Bearer ${apiTokenOrKey}`;
		const headers = { "Authorization":  authen }; 
		const options = { method: method, headers: headers, body: body };
		const res = await fetch(endpoint, options);
		const responseJSON = await res.json();
		const output = { 
			"results": {
				"input_lang" : `${sourceLanguage[0].toUpperCase()}${sourceLanguage.slice(1)}`,
				"input_text" : text, 
				"output_lang" : `${targetLanguage[0].toUpperCase()}${targetLanguage.slice(1)}`,
				"output_text": responseJSON.result.translated_text 
			}
		};

		return output;
	}

	async chatModel(content, role, model, provider, contentType, apiTokenOrKey, accountId)
	{
		if(provider === "cloudflare")
		{
			const body =  JSON.stringify( { "messages": [ { "role" : role, "content": content } ] } );
			const endpoint = `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`;
			const method = "POST";
			const authen = `Bearer ${apiTokenOrKey}`;
			const headers = { "Authorization":  authen,  "Content-Type": "application/json"  }; 
			const options = { method: method, headers: headers, body: body };
			const res = await fetch(endpoint, options);
			const responseJSON = await res.json();
			const response  = responseJSON.result.response;
			const results = response.replace(/(\r\n|\n|\r)/gm,"").replace(/(\r\*|\*|\r)/gm,"");
			const output = { "results" : results };
			return output;
		}


		if(provider === "openai")
		{
			const body =  JSON.stringify( { "model": model, "messages": [ { "role" : role, "content": content } ] } );
			const endpoint = `https://api.openai.com/v1/chat/completions`;
			const method = "POST";
			const authen = `Bearer ${apiTokenOrKey}`;
			const headers = { "Authorization":  authen, "Content-Type": "application/json"  }; 
			const options = { method: method, headers: headers, body: body };
			const res = await fetch(endpoint, options);
			const responseJSON = await res.json();
			const response  = responseJSON.choices[0].message.content
			const results = response.replace(/(\r\n|\n|\r)/gm,"").replace(/(\r\*|\*|\r)/gm,"")
			const output = { "results" : results  };
			return output;
		}
	}

	async testAIApp()
  	{
		const translate = true;
		const chat = true;
		const aipp = new AIApp();
		
		if(translate === true)
		{
			// translate:  Cloudlare provider model (model made by meta)
			const apiTokenOrKey = "myApiTokenOrKey";
			const accountId = "myAccountId";
			const contentType = "application/json";  
			const transModel = "@cf/meta/m2m100-1.2b"; 
			const text =  "What is you name?";
			const sourceLanguage = "english"; 
			const targetLanguage = "french";
			const transModelOutput = await aipp.translationModel(text, sourceLanguage, targetLanguage, transModel, contentType, apiTokenOrKey, accountId);

			if(transModelOutput)
			{ 
					await aipp.prettyPrint(transModelOutput);
					await aipp.separator();
			}
		}


		if(chat === true)
		{
			// message:  Cloudlare provider model (model made by meta or google)
			let apiTokenOrKey = "myApiTokenOrKey";
			let accountId = "myAccountId";
			let contentType = "application/json"; 
			let msgModel = "@cf/meta/llama-3-8b-instruct"  || "@hf/google/gemma-7b-it" || "@cf/google/gemma-7b-it-lora" || "@cf/google/gemma-2b-it-lora";
			let role = "user"
			let content = "Implement a JavaScript class for calculation sum of n numbers.";  // example
			let provider = "cloudflare";

			const msgModelOutputCloudflare = await  aipp.chatModel(content, role, msgModel, provider, contentType, apiTokenOrKey, accountId);
			
			if(msgModelOutputCloudflare)
			{ 
				await aipp.prettyPrint(msgModelOutputCloudflare);
				await aipp.separator()
			}


			// message:  OpenAPI provider model (model made by openai)
			apiTokenOrKey = "myApiTokenOrKey";
			accountId = "N-A";
			contentType = "application/json"; 
			msgModel =  "gpt-3.5-turbo-0125" || "gpt-4o-mini-2024-07-18" || "gpt-4o-2024-08-06" ; 
			role = "user";
			content = "Implement a JavaScript class for calculating sum of n numbers.";  // example
			provider = "openai";

			const msgModelOutputOpenai = await aipp.chatModel(content, role, msgModel, provider, contentType, apiTokenOrKey, accountId);
			
			if(msgModelOutputOpenai)
			{ 
				await aipp.prettyPrint(msgModelOutputOpenai);
				await aipp.separator()
			}
		}
	}
}


const aipp = new AIApp();
await aipp.testAIApp();
