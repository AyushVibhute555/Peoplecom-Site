import {describe,it,expect} from 'vitest';
import {filterWork} from '@/content/work';
describe('Selected work filters',()=>{
 it('includes the supplied real project in Brand Identity',()=>{expect(filterWork('Brand Identity',true).map(p=>p.title)).toEqual(['Curated Living Solutions']);});
 it('keeps unknown projects out of production',()=>{expect(filterWork('All',true).map(p=>p.id)).toEqual(['01']);expect(filterWork('All',false)).toHaveLength(4);});
 it('matches each deliverable filter',()=>{expect(filterWork('Web Design',false).map(p=>p.id)).toEqual(['02','04']);expect(filterWork('Web Development',false).map(p=>p.id)).toEqual(['03','04']);expect(filterWork('Web Design',true)).toHaveLength(0);});
});
