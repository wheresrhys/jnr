import {init as initSetList} from '../../components/set-list/enhancement';

export default function (del) {
	initSetList(del, this.data.list);
}