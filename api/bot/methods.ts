/*
export function fetchBot(
  method: string,
  request: string,
  onSuccess: (data: any) => void,
  onError: (error: any) => void
) {
  
  fetch(
    `https://api.telegram.org/bot${import.meta.env.VITE_BOT_TOKEN}/` + method, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "cache-control": "no-cache"
    },
    body: request
  })
  .then(response => {
    return response.json();
  })
  .then(response => {
    onSuccess({ status: 'done', payload: response });
  })
  .catch(error => {
    onError({ status: 'error', error });
  });
}

export function fetchBotFormData(
  method: string,
  request: FormData,
  onSuccess: (data: any) => void,
  onError: (error: any) => void
) {
  console.log('method: ', method);
  console.log('request: ', request);

  fetch(`https://api.telegram.org/bot${import.meta.env.VITE_BOT_TOKEN}/${method}`, {
    method: 'POST',
    body: request
  })
    .then(response => response.json())
    .then(response => onSuccess({ status: 'done', payload: response }))
    .catch(error => onError({ status: 'error', error }));
}

export function botMethod(
  method: string,
  request: string | FormData
) {
  return new Promise(function (resolve, reject) {
    if (typeof request === 'string') {
      fetchBot(
        method,
        request,
        function (result) {
          resolve(result)
        },
        function (error) {
          reject(error)
        }
      );
    } else if (typeof request === 'object') {
      console.log('request: ', typeof(request));
      fetchBotFormData(
        method,
        request,
        function (result) {
          resolve(result)
        },
        function (error) {
          reject(error)
        }
      );
    }
  });
}

export function sendMessage(
  request: string
) {
  return new Promise(function (resolve, reject) {
    fetchBot(
      'sendMessage',
      request,
      function (result) {
        resolve(result)
      },
      function (error) {
        reject(error)
      }
    );
  });
}

export function sendPhoto(
  request: string
) {
  return new Promise(function (resolve, reject) {
    fetchBot(
      'sendPhoto',
      request,
      function (result) {
        resolve(result)
      },
      function (error) {
        reject(error)
      }
    );
  });
}

*/

const BOT_TOKEN = process.env.BOT_TOKEN;

export interface PreparedInlineMessage {
  id: number;
  expiration_date: number;
}

/**
 * Sends a POST request to the specified Telegram Bot API method with the provided request body.
 *
 * @param {string} method - The Telegram Bot API method to call.
 * @param {string} request - The JSON stringified request body to be sent in the POST request.
 * @param {function} onSuccess - Callback function to be executed on a successful response.
 *        Receives an object containing the response payload.
 * @param {function} onError - Callback function to be executed if an error occurs.
 *        Receives an object containing the error details.
 */
export function fetchBot(
  method: string,
  request: string,
  onSuccess: (data: any) => void,
  onError: (error: any) => void
) {
  const token = BOT_TOKEN;
  console.log('token: ', token);
  console.log('request: ', request);
  console.log('method: ', method);
  fetch(
    `https://api.telegram.org/bot${token}/` + method, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "cache-control": "no-cache"
    },
    body: request
  })
  .then(response => {
    console.log('response: ', response);
    return response.json();
  })
  .then(response => {
    onSuccess({ status: 'done', payload: response });
  })
  .catch(error => {
    onError({ status: 'error', error });
  });
}

export function fetchBotJSON(
  method: string,
  request: any,
  onSuccess: (data: any) => void,
  onError: (error: any) => void
) {
  console.log('method: ', method);
  console.log('request: ', request);

  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
    method: 'POST',
    body: request
  }).then(response => response.json())
  .then(response => onSuccess({ status: 'done', payload: response }))
  .catch(error => onError({ status: 'error', error }));
}

export function fetchBotFormData(
  method: string,
  request: FormData,
  onSuccess: (data: any) => void,
  onError: (error: any) => void
) {
  console.log('method: ', method);
  console.log('request: ', request);

  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/${method}`, {
    method: 'POST',
    body: request
  })
    .then(response => response.json())
    .then(response => onSuccess({ status: 'done', payload: response }))
    .catch(error => onError({ status: 'error', error }));
}

/**
 * Sends a request to the Telegram Bot API.
 *
 * If the request is a string, it will be sent as a JSON payload.
 * If the request is a FormData, it will be sent as a multipart/form-data payload.
 *
 * @param {string} method The method to call on the Telegram Bot API.
 * @param {string | FormData} request The request to send to the Telegram Bot API.
 * @returns {Promise} A promise that resolves with the response from the Telegram Bot API.
 */
export function botMethod(
  method: string,
  request: string | FormData
) {
  return new Promise(function (resolve, reject) {
    if (typeof request === 'string') {
      console.log('request: ', request);
      fetchBot(
        method,
        request,
        function (result) {
          resolve(result)
        },
        function (error) {
          reject(error)
        }
      );
    } else if (typeof request === 'object') {
      console.log('request: ', request);
      fetchBotFormData(
        method,
        request,
        function (result) {
          resolve(result)
        },
        function (error) {
          reject(error)
        }
      );
    }
  });
}

/**
 * Преобразование FormData в JSON
 * @param formData 
 * @returns {string} JSON строка
 */
export function formDataToJson (formData: FormData) {
  return JSON.stringify(Object.fromEntries(formData));
}

/*
getUserProfilePhotos
--------------------
Use this method to get a list of profile pictures for a user. Returns a UserProfilePhotos object.

Parameter                   Type                    Required    Description
---------------------------------------------------------------------------
user_id                     Integer                 Yes         Unique identifier of the target user
offset                      Integer                 Optional    Sequential number of the first photo to be returned. By default, all photos are returned.
limit                       Integer                 Optional    Limits the number of photos to be retrieved. Values between 1-100 are accepted. Defaults to 100.
*/

export async function getUserProfilePhotos(
  request: string | FormData
) {
  return new Promise(function (resolve, reject) {
    if (typeof request === 'string') {
      fetchBot(
        'getUserProfilePhotos',
        request,
        function (result) {
          resolve(result)
        },
        function (error) {
          reject(error)
        }
      );
    } else {
      fetchBotFormData(
        'getUserProfilePhotos',
        request,
        function (result) {
          resolve(result)
        },
        function (error) {
          reject(error)
        }
      );
    }
  });
}

/*
getFile
-------
Use this method to get basic information about a file and prepare it for downloading. For the moment, bots can download files of up to 20MB in size. On success, a File object is returned. The file can then be downloaded via the link https://api.telegram.org/file/bot<token>/<file_path>, where <file_path> is taken from the response. It is guaranteed that the link will be valid for at least 1 hour. When the link expires, a new one can be requested by calling getFile again.

Parameter                   Type                    Required    Description
---------------------------------------------------------------------------
file_id                     String                  Yes         File identifier to get information about

Note: This function may not preserve the original file name and MIME type. You should save the file's MIME type and name (if available) when the File object is received.
*/
export function getFile(
  request: string | FormData
) {
  return new Promise(function (resolve, reject) {
    if (typeof request === 'string') {
      fetchBot(
        'getFile',
        request,
        function (result) {
          resolve(result)
        },
        function (error) {
          reject(error)
        }
      );
    } else {
      fetchBotFormData(
        'getFile',
        request,
        function (result) {
          resolve(result)
        },
        function (error) {
          reject(error)
        }
      );
    }
  });
}

/**
 * Получение blob файла по идентификатору
 * @param {string} fileId 
 * @returns {Blob}
 */
export async function getFileAsBlob(fileId: string): Promise<Blob | null> {
  const botToken = BOT_TOKEN;
  try {
    // 1. Получаем file_path через метод getFile
    const getFileResponse = await fetch(
      `https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`,
      {
        mode: 'no-cors',
        method: 'get'
      }
    );

    const getFileData = await getFileResponse.json();

    if (!getFileData.ok) {
      console.error('Ошибка при получении file_path:', getFileData);
      return null;
    }

    const filePath = getFileData.result.file_path;

    // 2. Формируем URL для скачивания файла
    const fileUrl = `https://api.telegram.org/file/bot${botToken}/${filePath}`;

    // 3. Загружаем файл и преобразуем в Blob
    const downloadResponse = await fetch(fileUrl);
    if (!downloadResponse.ok) {
      console.error('Ошибка при скачивании файла:', downloadResponse.statusText);
      return null;
    }

    const blob = await downloadResponse.blob();
    return blob;
  } catch (error) {
    console.error('Произошла ошибка:', error);
    return null;
  }
}

/*
sendMessage
-----------
Use this method to send text messages. On success, the sent Message is returned.

Parameter                   Type                    Required    Description
---------------------------------------------------------------------------
business_connection_id      String                  Optional	  Unique identifier of the business connection on behalf of which the message will be sent
chat_id                     Integer or String       Yes         Unique identifier for the target chat or username of the target channel (in the format @channelusername)
message_thread_id           Integer                 Optional    Unique identifier for the target message thread (topic) of the forum; for forum supergroups only
text                        String                  Yes         Text of the message to be sent, 1-4096 characters after entities parsing
parse_mode                  String                  Optional    Mode for parsing entities in the message text. See formatting options for more details.
entities                    Array of MessageEntity  Optional    A JSON-serialized list of special entities that appear in message text, which can be specified instead of parse_mode
link_preview_options        LinkPreviewOptions      Optional    Link preview generation options for the message
disable_notification        Boolean                 Optional    Sends the message silently. Users will receive a notification with no sound.
protect_content             Boolean                 Optional    Protects the contents of the sent message from forwarding and saving
allow_paid_broadcast        Boolean                 Optional    Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance
message_effect_id           String                  Optional    Unique identifier of the message effect to be added to the message; for private chats only
reply_parameters            ReplyParameters         Optional    Description of the message to reply to
reply_markup                InlineKeyboardMarkup or
                            ReplyKeyboardMarkup or
                            ReplyKeyboardRemove or
                            ForceReply              Optional    Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user
*/

/**
 * Use this method to send text messages. On success, the sent Message is returned.
 * @param {string} request The JSON stringified request body.
 * @return {Promise} A Promise that resolves with the response, or rejects with any error.
 */
export function sendMessage(
  request: string
) {
  return new Promise(function (resolve, reject) {
    fetchBot(
      'sendMessage',
      request,
      function (result) {
        resolve(result)
      },
      function (error) {
        reject(error)
      }
    );
  });
}

/*
sendPhoto
---------
Use this method to send photos. On success, the sent Message is returned.

Parameter                   Type                    Required    Description
---------------------------------------------------------------------------
business_connection_id      String                  Optional    Unique identifier of the business connection on behalf of which the message will be sent
chat_id                     Integer or String       Yes         Unique identifier for the target chat or username of the target channel (in the format @channelusername)
message_thread_id           Integer                 Optional    Unique identifier for the target message thread (topic) of the forum; for forum supergroups only
photo                       InputFile or String     Yes         Photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a photo from the Internet, or upload a new photo using multipart/form-data. The photo must be at most 10 MB in size. The photo's width and height must not exceed 10000 in total. Width and height ratio must be at most 20. More information on Sending Files »
caption                     String                  Optional    Photo caption (may also be used when resending photos by file_id), 0-1024 characters after entities parsing
parse_mode                  String                  Optional    Mode for parsing entities in the photo caption. See formatting options for more details.
caption_entities            Array of MessageEntity  Optional    A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode
show_caption_above_media    Boolean                 Optional    Pass True, if the caption must be shown above the message media
has_spoiler                 Boolean                 Optional    Pass True if the photo needs to be covered with a spoiler animation
disable_notification        Boolean                 Optional    Sends the message silently. Users will receive a notification with no sound.
protect_content             Boolean                 Optional	  Protects the contents of the sent message from forwarding and saving
allow_paid_broadcast        Boolean                 Optional	  Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance
message_effect_id           String                  Optional	  Unique identifier of the message effect to be added to the message; for private chats only
reply_parameters            ReplyParameters         Optional	  Description of the message to reply to
reply_markup                InlineKeyboardMarkup or
                            ReplyKeyboardMarkup or
                            ReplyKeyboardRemove or
                            ForceReply              Optional    Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user
*/

/**
 * Use this method to send photos. On success, the sent Message is returned.
 * @param {string} request The JSON stringified request body.
 * @return {Promise} A Promise that resolves with the response, or rejects with any error.
 */
export function sendPhoto(
  request: string
) {
  return new Promise(function (resolve, reject) {
    fetchBot(
      'sendPhoto',
      request,
      function (result) {
        resolve(result)
      },
      function (error) {
        reject(error)
      }
    );
  });
}

/*
sendAudio
---------
Use this method to send audio files, if you want Telegram clients to display them in the music player. Your audio must be in the .MP3 or .M4A format. On success, the sent Message is returned. Bots can currently send audio files of up to 50 MB in size, this limit may be changed in the future.

For sending voice messages, use the sendVoice method instead.

Parameter                   Type                    Required    Description
---------------------------------------------------------------------------
business_connection_id      String                  Optional    Unique identifier of the business connection on behalf of which the message will be sent
chat_id                     Integer or String       Yes         Unique identifier for the target chat or username of the target channel (in the format @channelusername)
message_thread_id           Integer                 Optional    Unique identifier for the target message thread (topic) of the forum; for forum supergroups only
audio                       InputFile or String     Yes         Audio file to send. Pass a file_id as String to send an audio file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an audio file from the Internet, or upload a new one using multipart/form-data. More information on Sending Files »
caption                     String                  Optional    Audio caption, 0-1024 characters after entities parsing
parse_mode                  String                  Optional    Mode for parsing entities in the audio caption. See formatting options for more details.
caption_entities            Array of MessageEntity  Optional    A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode
duration                    Integer                 Optional    Duration of the audio in seconds
performer                   String                  Optional    Performer
title                       String                  Optional    Track name
thumbnail                   InputFile or String     Optional    Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file_attach_name>” if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More information on Sending Files »
disable_notification        Boolean                 Optional    Sends the message silently. Users will receive a notification with no sound.
protect_content             Boolean                 Optional    Protects the contents of the sent message from forwarding and saving
allow_paid_broadcast        Boolean                 Optional    Pass True to allow up to 1000 messages per second, ignoring broadcasting limits for a fee of 0.1 Telegram Stars per message. The relevant Stars will be withdrawn from the bot's balance
message_effect_id           String                  Optional    Unique identifier of the message effect to be added to the message; for private chats only
reply_parameters            ReplyParameters         Optional    Description of the message to reply to
reply_markup                InlineKeyboardMarkup or
                            ReplyKeyboardMarkup or
                            ReplyKeyboardRemove or
                            ForceReply              Optional    Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove a reply keyboard or to force a reply from the user
*/


/*
savePreparedInlineMessage
-------------------------
Stores a message that can be sent by a user of a Mini App. Returns a PreparedInlineMessage object.

Parameter                   Type                    Required    Description
user_id                     Integer                 Yes         Unique identifier of the target user that can use the prepared message
result                      InlineQueryResult       Yes         A JSON-serialized object describing the message to be sent
allow_user_chats            Boolean                 Optional    Pass True if the message can be sent to private chats with users
allow_bot_chats             Boolean                 Optional    Pass True if the message can be sent to private chats with bots
allow_group_chats           Boolean                 Optional    Pass True if the message can be sent to group and supergroup chats
allow_channel_chats         Boolean                 Optional    Pass True if the message can be sent to channel chats
*/

/**
 * Use this method to save prepared inline messages. On success, the PreparedInlineMessage is returned.
 * @param {string} request The JSON stringified request body.
 * @return {Promise} A Promise that resolves with the response, or rejects with any error. 
 */
export function savePreparedInlineMessage(
  request: string
) {
  return new Promise(function (resolve, reject) {
    fetchBot(
      'savePreparedInlineMessage',
      request,
      function (result) {
        resolve(result)
      },
      function (error) {
        reject(error)
      }
    );
  });
}

/*
PreparedInlineMessage
---------------------
Describes an inline message to be sent by a user of a Mini App.

Field                       Type                                Description
id                          String                              Unique identifier of the prepared message
expiration_date             Integer                             Expiration date of the prepared message, in Unix time. Expired prepared messages can no longer be used

InlineQueryResult
-----------------
This object represents one result of an inline query. Telegram clients currently support results of the following 20 types:

InlineQueryResultCachedAudio
InlineQueryResultCachedDocument
InlineQueryResultCachedGif
InlineQueryResultCachedMpeg4Gif
InlineQueryResultCachedPhoto
InlineQueryResultCachedSticker
InlineQueryResultCachedVideo
InlineQueryResultCachedVoice
InlineQueryResultArticle
InlineQueryResultAudio
InlineQueryResultContact
InlineQueryResultGame
InlineQueryResultDocument
InlineQueryResultGif
InlineQueryResultLocation
InlineQueryResultMpeg4Gif
InlineQueryResultPhoto
InlineQueryResultVenue
InlineQueryResultVideo
InlineQueryResultVoice
Note: All URLs passed in inline query results will be available to end users and therefore must be assumed to be public.

InlineQueryResultArticle
------------------------
Represents a link to an article or web page.

Field                       Type                                  Description
-----------------------------------------------------------------------------
type                        String                                Type of the result, must be article
id                          String                                Unique identifier for this result, 1-64 Bytes
title                       String                                Title of the result
input_message_content       InputMessageContent                   Content of the message to be sent
reply_markup                InlineKeyboardMarkup                  Optional. Inline keyboard attached to the message
url                         String                                Optional. URL of the result
hide_url                    Boolean                               Optional. Pass True if you don't want the URL to be shown in the message
description                 String                                Optional. Short description of the result
thumbnail_url               String                                Optional. Url of the thumbnail for the result
thumbnail_width             Integer	Optional. Thumbnail width
thumbnail_height            Integer	Optional. Thumbnail height

InlineQueryResultPhoto
----------------------
Represents a link to a photo. By default, this photo will be sent by the user with optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the photo.

Field                       Type                                  Description
-----------------------------------------------------------------------------
type                        String                                Type of the result, must be photo
id                          String                                Unique identifier for this result, 1-64 bytes
photo_url                   String                                A valid URL of the photo. Photo must be in JPEG format. Photo size must not exceed 5MB
thumbnail_url               String                                URL of the thumbnail for the photo
photo_width                 Integer                               Optional. Width of the photo
photo_height                Integer                               Optional. Height of the photo
title                       String                                Optional. Title for the result
description                 String                                Optional. Short description of the result
caption                     String                                Optional. Caption of the photo to be sent, 0-1024 characters after entities parsing
parse_mode                  String                                Optional. Mode for parsing entities in the photo caption. See formatting options for more details.
caption_entities            Array of MessageEntity                Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
reply_markup                InlineKeyboardMarkup                  Optional. Inline keyboard attached to the message
input_message_content       InputMessageContent                   Optional. Content of the message to be sent instead of the photo


InlineQueryResultGif
--------------------
Represents a link to an animated GIF file. By default, this animated GIF file will be sent by the user with optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the animation.

Field                       Type                                  Description
-----------------------------------------------------------------------------
type                        String                                Type of the resultm must be gif
id                          String                                Unique identifier for this result, 1-64 bytes
gif_url                     String                                A valid URL for the GIF file. File size must not exceed 1MB
gif_width                   Integer                               Optional. Width of the GIF
gif_height                  Integer                               Optional. Height of the GIF
gif_duration                Integer                               Optional. Duration of the GIF in seconds
thumbnail_url               String                                URL of the static (JPEG or GIF) or animated (MPEG4) thumbnail for the result
thumbnail_mime_type         String                                Optional. MIME type of the thumbnail, must be one of “image/jpeg”, “image/gif”, or “video/mp4”. Defaults to “image/jpeg”
title                       String                                Optional. Title for the result
caption                     String                                Optional. Caption of the GIF file to be sent, 0-1024 characters after entities parsing
parse_mode                  String                                Optional. Mode for parsing entities in the caption. See formatting options for more details.
caption_entities            Array of MessageEntity                Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
show_caption_above_media    Boolean                               Optional. Pass True, if the caption must be shown above the message media
reply_markup                InlineKeyboardMarkup                  Optional. Inline keyboard attached to the message
input_message_content       InputMessageContent                   Optional. Content of the message to be sent instead of the GIF animation

InlineQueryResultMpeg4Gif
-------------------------
Represents a link to a video animation (H.264/MPEG-4 AVC video without sound). By default, this animated MPEG-4 file will be sent by the user with optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the animation.

Field                       Type                                  Description
-----------------------------------------------------------------------------
type                        String                                Type of the result, must be mpeg4_gif
id                          String                                Unique identifier for this result, 1-64 bytes
mpeg4_url                   String                                A valid URL for the MPEG4 file. File size must not exceed 1MB
mpeg4_width                 Integer                               Optional. Video width
mpeg4_height                Integer                               Optional. Video height
mpeg4_duration              Integer                               Optional. Video duration in seconds
thumbnail_url               String                                URL of the static (JPEG or GIF) or animated (MPEG4) thumbnail for the result
thumbnail_mime_type         String                                Optional. MIME type of the thumbnail, must be one of “image/jpeg”, “image/gif”, or “video/mp4”. Defaults to “image/jpeg”
title                       String                                Optional. Title for the result
caption                     String                                Optional. Caption of the MPEG-4 file to be sent, 0-1024 characters after entities parsing
parse_mode                  String                                Optional. Mode for parsing entities in the caption. See formatting options for more details.
caption_entities            Array of MessageEntity                Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
show_caption_above_media    Boolean                               Optional. Pass True, if the caption must be shown above the message media
reply_markup                InlineKeyboardMarkup                  Optional. Inline keyboard attached to the message
input_message_content       InputMessageContent                   Optional. Content of the message to be sent instead of the video animation

InlineQueryResultVideo
----------------------
Represents a link to a page containing an embedded video player or a video file. By default, this video file will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the video.

If an InlineQueryResultVideo message contains an embedded video (e.g., YouTube), you must replace its content using input_message_content.

Field                       Type                                  Description
-----------------------------------------------------------------------------
type                        String                                Type of the result, must be video
id                          String                                Unique identifier for this result, 1-64 bytes
video_url                   String                                A valid URL for the embedded video player or video file
mime_type                   String                                MIME type of the content of the video URL, “text/html” or “video/mp4”
thumbnail_url               String                                URL of the thumbnail (JPEG only) for the video
title                       String                                Title for the result
caption                     String                                Optional. Caption of the video to be sent, 0-1024 characters after entities parsing
parse_mode                  String                                Optional. Mode for parsing entities in the video caption. See formatting options for more details.
caption_entities            Array of MessageEntity                Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
show_caption_above_media    Boolean                               Optional. Pass True, if the caption must be shown above the message media
video_width                 Integer                               Optional. Video width
video_height                Integer                               Optional. Video height
video_duration              Integer                               Optional. Video duration in seconds
description                 String                                Optional. Short description of the result
reply_markup                InlineKeyboardMarkup                  Optional. Inline keyboard attached to the message
input_message_content       InputMessageContent                   Optional. Content of the message to be sent instead of the video. This field is required if InlineQueryResultVideo is used to send an HTML-page as a result (e.g., a YouTube video).

InlineQueryResultAudio
----------------------
Represents a link to an MP3 audio file. By default, this audio file will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the audio.

Field                       Type                                  Description
-----------------------------------------------------------------------------
type                        String                                Type of the result, must be audio
id                          String                                Unique identifier for this result, 1-64 bytes
audio_url                   String                                A valid URL for the audio file
title                       String                                Title
caption                     String                                Optional. Caption, 0-1024 characters after entities parsing
parse_mode                  String                                Optional. Mode for parsing entities in the audio caption. See formatting options for more details.
caption_entities            Array of MessageEntity                Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
performer                   String                                Optional. Performer
audio_duration              Integer                               Optional. Audio duration in seconds
reply_markup                InlineKeyboardMarkup                  Optional. Inline keyboard attached to the message
input_message_content       InputMessageContent                   Optional. Content of the message to be sent instead of the audio

InlineQueryResultVoice
----------------------
Represents a link to a voice recording in an .OGG container encoded with OPUS. By default, this voice recording will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the the voice message.

Field                       Type                                  Description
-----------------------------------------------------------------------------
type                        String                                Type of the result, must be voice
id                          String                                Unique identifier for this result, 1-64 bytes
voice_url                   String                                A valid URL for the voice recording
title                       String                                Recording title
caption                     String                                Optional. Caption, 0-1024 characters after entities parsing
parse_mode                  String                                Optional. Mode for parsing entities in the voice message caption. See formatting options for more details.
caption_entities            Array of MessageEntity                Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
voice_duration              Integer                               Optional. Recording duration in seconds
reply_markup                InlineKeyboardMarkup                  Optional. Inline keyboard attached to the message
input_message_content       InputMessageContent                   Optional. Content of the message to be sent instead of the voice recording

InlineQueryResultDocument
-------------------------
Represents a link to a file. By default, this file will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the file. Currently, only .PDF and .ZIP files can be sent using this method.

Field                       Type                                  Description
-----------------------------------------------------------------------------
type                        String                                Type of the result, must be document
id                          String                                Unique identifier for this result, 1-64 bytes
title                       String                                Title for the result
caption                     String                                Optional. Caption of the document to be sent, 0-1024 characters after entities parsing
parse_mode                  String                                Optional. Mode for parsing entities in the document caption. See formatting options for more details.
caption_entities            Array of MessageEntity                Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
document_url                String                                A valid URL for the file
mime_type                   String                                MIME type of the content of the file, either “application/pdf” or “application/zip”
description                 String                                Optional. Short description of the result
reply_markup                InlineKeyboardMarkup                  Optional. Inline keyboard attached to the message
input_message_content       InputMessageContent                   Optional. Content of the message to be sent instead of the file
thumbnail_url               String                                Optional. URL of the thumbnail (JPEG only) for the file
thumbnail_width             Integer                               Optional. Thumbnail width
thumbnail_height            Integer                               Optional. Thumbnail height

InlineQueryResultLocation
-------------------------
Represents a location on a map. By default, the location will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the location.

Field                       Type                                  Description
-----------------------------------------------------------------------------
type                        String                                Type of the result, must be location
id                          String                                Unique identifier for this result, 1-64 Bytes
latitude                    Float                                 Location latitude in degrees
longitude                   Float                                 Location longitude in degrees
title                       String                                Location title
horizontal_accuracy         Float                                 Optional. The radius of uncertainty for the location, measured in meters; 0-1500
live_period                 Integer                               Optional. Period in seconds during which the location can be updated, should be between 60 and 86400, or 0x7FFFFFFF for live locations that can be edited indefinitely.
heading                     Integer                               Optional. For live locations, a direction in which the user is moving, in degrees. Must be between 1 and 360 if specified.
proximity_alert_radius      Integer                               Optional. For live locations, a maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified.
reply_markup                InlineKeyboardMarkup                  Optional. Inline keyboard attached to the message
input_message_content       InputMessageContent                   Optional. Content of the message to be sent instead of the location
thumbnail_url               String                                Optional. Url of the thumbnail for the result
thumbnail_width             Integer                               Optional. Thumbnail width
thumbnail_height            Integer                               Optional. Thumbnail height

InlineQueryResultVenue
----------------------
Represents a venue. By default, the venue will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the venue.

Field                       Type                                  Description
-----------------------------------------------------------------------------
type                        String                                Type of the result, must be venue
id                          String                                Unique identifier for this result, 1-64 Bytes
latitude                    Float                                 Latitude of the venue location in degrees
longitude                   Float                                 Longitude of the venue location in degrees
title                       String                                Title of the venue
address                     String                                Address of the venue
foursquare_id               String                                Optional. Foursquare identifier of the venue if known
foursquare_type             String                                Optional. Foursquare type of the venue, if known. (For example, “arts_entertainment/default”, “arts_entertainment/aquarium” or “food/icecream”.)
google_place_id             String                                Optional. Google Places identifier of the venue
google_place_type           String                                Optional. Google Places type of the venue. (See supported types.)
reply_markup                InlineKeyboardMarkup                  Optional. Inline keyboard attached to the message
input_message_content       InputMessageContent                   Optional. Content of the message to be sent instead of the venue
thumbnail_url               String                                Optional. Url of the thumbnail for the result
thumbnail_width             Integer                               Optional. Thumbnail width
thumbnail_height            Integer                               Optional. Thumbnail height

InlineQueryResultContact
------------------------
Represents a contact with a phone number. By default, this contact will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the contact.

Field                       Type                                  Description
-----------------------------------------------------------------------------
type                        String                                Type of the result, must be contact
id                          String                                Unique identifier for this result, 1-64 Bytes
phone_number                String                                Contact's phone number
first_name                  String                                Contact's first name
last_name                   String                                Optional. Contact's last name
vcard                       String                                Optional. Additional data about the contact in the form of a vCard, 0-2048 bytes
reply_markup                InlineKeyboardMarkup                  Optional. Inline keyboard attached to the message
input_message_content       InputMessageContent                   Optional. Content of the message to be sent instead of the contact
thumbnail_url               String                                Optional. Url of the thumbnail for the result
thumbnail_width             Integer                               Optional. Thumbnail width
thumbnail_height            Integer                               Optional. Thumbnail height

InlineQueryResultGame
---------------------
Represents a Game.

Field                       Type                                  Description
-----------------------------------------------------------------------------
type                        String                                Type of the result, must be game
id                          String                                Unique identifier for this result, 1-64 bytes
game_short_name             String                                Short name of the game
reply_markup                InlineKeyboardMarkup                  Optional. Inline keyboard attached to the message

InlineQueryResultCachedPhoto
----------------------------
Represents a link to a photo stored on the Telegram servers. By default, this photo will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the photo.

Field                       Type                                  Description
-----------------------------------------------------------------------------
type                        String                                Type of the result, must be photo
id                          String                                Unique identifier for this result, 1-64 bytes
photo_file_id               String                                A valid file identifier of the photo
title                       String                                Optional. Title for the result
description                 String                                Optional. Short description of the result
caption                     String                                Optional. Caption of the photo to be sent, 0-1024 characters after entities parsing
parse_mode                  String                                Optional. Mode for parsing entities in the photo caption. See formatting options for more details.
caption_entities            Array of MessageEntity                Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
show_caption_above_media    Boolean                               Optional. Pass True, if the caption must be shown above the message media
reply_markup                InlineKeyboardMarkup                  Optional. Inline keyboard attached to the message
input_message_content       InputMessageContent                   Optional. Content of the message to be sent instead of the photo

InlineQueryResultCachedGif
--------------------------
Represents a link to an animated GIF file stored on the Telegram servers. By default, this animated GIF file will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with specified content instead of the animation.

Field                       Type                                  Description
-----------------------------------------------------------------------------
type                        String                                Type of the result, must be gif
id                          String                                Unique identifier for this result, 1-64 bytes
gif_file_id                 String                                A valid file identifier for the GIF file
title                       String                                Optional. Title for the result
caption                     String                                Optional. Caption of the GIF file to be sent, 0-1024 characters after entities parsing
parse_mode                  String                                Optional. Mode for parsing entities in the caption. See formatting options for more details.
caption_entities            Array of MessageEntity                Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
show_caption_above_media    Boolean                               Optional. Pass True, if the caption must be shown above the message media
reply_markup                InlineKeyboardMarkup                  Optional. Inline keyboard attached to the message
input_message_content       InputMessageContent                   Optional. Content of the message to be sent instead of the GIF animation

InlineQueryResultCachedMpeg4Gif
-------------------------------
Represents a link to a video animation (H.264/MPEG-4 AVC video without sound) stored on the Telegram servers. By default, this animated MPEG-4 file will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the animation.

Field                       Type                                  Description
-----------------------------------------------------------------------------
type                        String                                Type of the result, must be mpeg4_gif
id                          String                                Unique identifier for this result, 1-64 bytes
mpeg4_file_id               String                                A valid file identifier for the MPEG4 file
title                       String                                Optional. Title for the result
caption                     String                                Optional. Caption of the MPEG-4 file to be sent, 0-1024 characters after entities parsing
parse_mode                  String                                Optional. Mode for parsing entities in the caption. See formatting options for more details.
caption_entities            Array of MessageEntity                Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
show_caption_above_media    Boolean                               Optional. Pass True, if the caption must be shown above the message media
reply_markup                InlineKeyboardMarkup                  Optional. Inline keyboard attached to the message
input_message_content       InputMessageContent                   Optional. Content of the message to be sent instead of the video animation

InlineQueryResultCachedSticker
------------------------------
Represents a link to a sticker stored on the Telegram servers. By default, this sticker will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the sticker.

Field                       Type                                  Description
-----------------------------------------------------------------------------
type                        String                                Type of the result, must be sticker
id                          String                                Unique identifier for this result, 1-64 bytes
sticker_file_id             String                                A valid file identifier of the sticker
reply_markup                InlineKeyboardMarkup                  Optional. Inline keyboard attached to the message
input_message_content       InputMessageContent                   Optional. Content of the message to be sent instead of the sticker

InlineQueryResultCachedDocument
-------------------------------
Represents a link to a file stored on the Telegram servers. By default, this file will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the file.

Field                       Type                                  Description
-----------------------------------------------------------------------------
type                        String                                Type of the result, must be document
id                          String                                Unique identifier for this result, 1-64 bytes
title                       String                                Title for the result
document_file_id            String                                A valid file identifier for the file
description                 String                                Optional. Short description of the result
caption                     String                                Optional. Caption of the document to be sent, 0-1024 characters after entities parsing
parse_mode                  String                                Optional. Mode for parsing entities in the document caption. See formatting options for more details.
caption_entities            Array of MessageEntity                Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
reply_markup                InlineKeyboardMarkup                  Optional. Inline keyboard attached to the message
input_message_content       InputMessageContent                   Optional. Content of the message to be sent instead of the file

InlineQueryResultCachedVideo
----------------------------
Represents a link to a video file stored on the Telegram servers. By default, this video file will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the video.

Field                       Type                                  Description
-----------------------------------------------------------------------------
type                        String                                Type of the result, must be video
id                          String                                Unique identifier for this result, 1-64 bytes
video_file_id               String                                A valid file identifier for the video file
title                       String                                Title for the result
description                 String                                Optional. Short description of the result
caption                     String                                Optional. Caption of the video to be sent, 0-1024 characters after entities parsing
parse_mode                  String                                Optional. Mode for parsing entities in the video caption. See formatting options for more details.
caption_entities            Array of MessageEntity                Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
show_caption_above_media    Boolean                               Optional. Pass True, if the caption must be shown above the message media
reply_markup                InlineKeyboardMarkup                  Optional. Inline keyboard attached to the message
input_message_content       InputMessageContent                   Optional. Content of the message to be sent instead of the video

InlineQueryResultCachedVoice
----------------------------
Represents a link to a voice message stored on the Telegram servers. By default, this voice message will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the voice message.

Field                       Type                                  Description
-----------------------------------------------------------------------------
type                        String                                Type of the result, must be voice
id                          String                                Unique identifier for this result, 1-64 bytes
voice_file_id               String                                A valid file identifier for the voice message
title                       String                                Voice message title
caption                     String                                Optional. Caption, 0-1024 characters after entities parsing
parse_mode                  String                                Optional. Mode for parsing entities in the voice message caption. See formatting options for more details.
caption_entities            Array of MessageEntity                Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
reply_markup                InlineKeyboardMarkup                  Optional. Inline keyboard attached to the message
input_message_content       InputMessageContent                   Optional. Content of the message to be sent instead of the voice message

InlineQueryResultCachedAudio
----------------------------
Represents a link to an MP3 audio file stored on the Telegram servers. By default, this audio file will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the audio.

Field                       Type                                  Description
-----------------------------------------------------------------------------
type                        String                                Type of the result, must be audio
id                          String                                Unique identifier for this result, 1-64 bytes
audio_file_id               String                                A valid file identifier for the audio file
caption                     String                                Optional. Caption, 0-1024 characters after entities parsing
parse_mode                  String                                Optional. Mode for parsing entities in the audio caption. See formatting options for more details.
caption_entities            Array of MessageEntity                Optional. List of special entities that appear in the caption, which can be specified instead of parse_mode
reply_markup                InlineKeyboardMarkup                  Optional. Inline keyboard attached to the message
input_message_content       InputMessageContent                   Optional. Content of the message to be sent instead of the audio



*/

/**
 * Удаление сообщений в чате
 * @param {number} chat_id 
 * @param {number} message_id 
 */
export function deleteMessage(
  chat_id: number,
  message_id: number
) {
  /*
  deleteMessage
  ---------------------------------------------------------------------------------------------
  Используйте этот метод для удаления сообщений, в том числе служебных, со следующими ограничениями:
  - Сообщение может быть удалено, только если оно было отправлено менее 48 часов назад.
  - Служебные сообщения о создании супергруппы, канала или темы на форуме удалить невозможно.
  - Сообщение dice в приватном чате можно удалить, только если оно было отправлено более 24 часов назад.
  - Боты могут удалять исходящие сообщения в приватных чатах, группах и супергруппах.
  - Боты могут удалять входящие сообщения в личных чатах.
  - Боты с разрешением can_post_messages могут удалять исходящие сообщения в каналах.
  - Если бот является администратором группы, он может удалить любое сообщение в ней.
  - Если у бота есть разрешение can_delete_messages в супергруппе или канале, он может удалить любое сообщение в них.
  При успешном выполнении возвращает True.

  Параметр    Тип                 Обязательный  Описание
  ---------------------------------------------------------------------------------------------
  chat_id     Integer или String  Да            Уникальный идентификатор целевого чата или имя пользователя целевого канала (в формате @channelusername)
  message_id  Integer             Да            Идентификатор сообщения, которое требуется удалить.
  */
  const FD = new FormData();
  FD.append('chat_id', chat_id.toString());
  FD.append('message_id', message_id.toString());
  
  botMethod(
    'deleteMessage',
    FD
  ).then((result: any) => {
    console.log(result);
  }).catch((error)=>{
    console.log(error);
  });
}