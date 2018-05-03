import pkg from 'appPackage';
import { CONFIG } from 'appConstants';
import url from 'url';
import logger from 'logger';
export const isForSafeServer = ( parsedUrlObject ) =>
    parsedUrlObject.host === `localhost:${CONFIG.PORT}`;


export const urlIsAllowed = ( testUrl ) =>
{
    const urlObj = url.parse( testUrl );

    const validProtocols = pkg.build.protocols.schemes || ['http'];
    const adaptedProtocols = validProtocols.map( proto => `${proto}:` );

    if ( adaptedProtocols.includes( urlObj.protocol ) || isForSafeServer( urlObj ) ||
        urlObj.protocol === 'chrome-devtools:' || urlObj.protocol === 'file:' ||
        urlObj.protocol === 'blob:' )
    {
        return true;
    }

    if ( urlObj.hostname === '127.0.0.1' || urlObj.hostname === 'localhost' )
    {
        return true;
    }

    return false;
};

export const generateBoundaryStr = () => 
{
    let text = '';
    const charSet = 'abcdefghijklmnopqrstuvwxyz0123456789';
    
    for (let i = 0; i < 13; i++) {
      text += charSet.charAt(Math.floor(Math.random() * charSet.length));
    }
    
    return text;
};

export const rangeStringToArray = (rangeString) => 
{
    const BYTES = 'bytes=';
    return rangeString.substring( BYTES.length, rangeString.length )
      .split( ',' )
      .map(part => 
      {
          const partObj = {}; 
          part.split('-')
              .forEach((int, i) => 
              {
                if (i === 0) 
                {
                  if ( Number.isInteger(parseInt(int, 10)) )
                  {
                    partObj.start = parseInt(int, 10);
                  }
                  else
                  {
                    partObj.start = null;
                  }
                }
                else if (i === 1) 
                {
                  if ( Number.isInteger(parseInt(int, 10)) )
                  {
                    partObj.end = parseInt(int, 10);
                  }
                  else
                  {
                    partObj.end = null;
                  }
                }
              });
          return partObj;
      });
};

export const generateResponseStr = (data) => {
  const boundaryStr = generateBoundaryStr();
  const crlf = "\r\n";
  let responseStr = `HTTP/1.1 206 Partial Content${crlf}`;
  responseStr += `Content-Type: multipart/byteranges; boundary=${boundaryStr}${crlf}`;
  responseStr += `Content-Length:${data.headers['Content-Length']}${crlf}`;
  data.parts.forEach((part) => {
    responseStr += `--${boundaryStr}${crlf}`;
    responseStr += `Content-Type:${part.headers['Content-Type']}${crlf}`;
    responseStr += `Content-Range: ${part.headers['Content-Range']}${crlf}`;
    responseStr += `${part.body}${crlf}`;
  });
  responseStr += `--${boundaryStr}--`;
  return responseStr;
};
