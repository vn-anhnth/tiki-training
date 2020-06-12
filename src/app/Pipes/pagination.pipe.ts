import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'pagination'
})
export class PaginationPipe implements PipeTransform {

    transform(totalItems: number, itemsPerPage: number, limitRange: number, selectedPage: number): any {
        let lastPage: number = Math.ceil(totalItems / itemsPerPage);
        const listPage: Array<number> = [];
        // lastPage = selectedPage -> limitRange
        // 3 = 1 -> 3
        // 3 = 1 + 3 -1
        if (lastPage > limitRange && selectedPage + limitRange - 1 < lastPage) {
            lastPage = selectedPage + limitRange - 1;
        }
        for (let i = selectedPage; i <= lastPage; i++) {
            listPage.push(i);
        }
        if (listPage.length < limitRange) {
            const listPageLen = limitRange - listPage.length;
            for (let i = 1; i <= listPageLen; i++) {
                if (listPage[0] - i === 0) {
                    continue;
                }
                listPage.push(listPage[0] - i);
            }
        }
        return listPage.sort((a, b) => a - b);
    }
}
