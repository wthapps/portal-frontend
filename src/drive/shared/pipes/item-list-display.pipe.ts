import { PipeTransform, Pipe } from '@angular/core';
import { Constants } from '@shared/constant';

const CLOUDFRONT = Constants.cloudfront;

@Pipe({ name: 'itemListDisplay' })
export class ItemListDisplayPipe implements PipeTransform {
  transform(items: any[], viewMode = 'grid'): any {
    const size = viewMode === 'list' ? '100x100' : '200x200';
    return items.map(item => {
      if (item && item.content_type && item.content_type.startsWith('image')) {
        // TODO: Calculate thumbnail image base on original image url and view mode
        // https://s3-us-west-2.amazonaws.com/development-oregon/giphy.gif => https://d9njqd2jjuvpj.cloudfront.net/fit-in/100x100/giphy.gif
        // const thumbnail_image = `${THUMB_CF}/${size}/${item.image}`;
        const temp_thumbnail_url =
          item.thumbnail_url || `${CLOUDFRONT}/${size}/${item.file_upload_id}`;
        return { ...item, temp_thumbnail_url };
      } else {
        return item;
      }
    });
  }
}
