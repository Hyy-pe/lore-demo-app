const apikey = 'PUT_YOUR_FILESTACK_API_KEY_HERE_OR_USE_YOUR_OWN_CUSTOM_IMAGE_UPLOADING_URL';
const client = filestack.init(apikey);


const editor = new EditorJS({
    holder: 'editorjs',
/** 
     * Available Tools list. 
     * Pass Tool's class or Settings object for each Tool you want to use 
     */
   tools:{
       header:Header,
       paragraph: {
        class: Paragraph,
        inlineToolbar: true,
      },
      embed: Embed,
      list: {
      class: List,
      inlineToolbar: true,
      config: {
        defaultStyle: 'unordered'
      }
    },
      quote: {
      class: Quote,
      inlineToolbar: true,
      shortcut: 'CMD+SHIFT+O',
      config: {
        quotePlaceholder: 'Enter a quote',
        captionPlaceholder: 'Quote\'s author',
      },
    },
      image: {
          class: ImageTool,
          config: {
        /**
         * Custom uploader
         */
        uploader: {
          /**
           * Upload file to the server and return an uploaded image data
           * @param {File} file - file selected from the device or pasted by drag-n-drop
           * @return {Promise.<{success, file: {url}}>}
           */
          uploadByFile(file){
            // your own uploading logic here
            
            return client.upload(file).then(function(res) {
              
              return {
                success: 1,
                
                file: {
                  url: res.url,
                  status: res.status,
                  // any other image data you want to store, such as width, height, color, extension, etc
                }

              }

            });
          }
          
        }
    }}
    }
}
);

