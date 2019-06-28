import { PipeTransform, Pipe } from '@angular/core';
import { Constants } from '@shared/constant';

const CLOUDFRONT = Constants.cloudfront;
const BUCKET = Constants.s3Bucket;

@Pipe({ name: 'itemListDisplay' })
export class ItemListDisplayPipe implements PipeTransform {
  transform(items: any[], viewMode = 'grid'): any {
    const size = (viewMode === 'list' ? 50 : 400);
    
    return items.map(item => {
      if (item && item.content_type && item.content_type.startsWith('image')) {
        const dynamicThumb = this.imageRequest(BUCKET, item.file_upload_id, {'resize': {'width': size, 'height': size}});
        const temp_thumbnail_url =
          item.thumbnail_url || dynamicThumb;
        
        return { ...item, temp_thumbnail_url };
      } else {
        return item;
      }
    });
  }

  // Output: 'https://d3ukayp3hgsz16.cloudfront.net/<encoded_url>
  private imageRequest(bucket, key, edits = {}) {
    const request = JSON.stringify({
        'bucket': bucket,
        'key': key,
        'edits': edits
    });

    return `${CLOUDFRONT}/${btoa(request)}`;

  }
}
