import {init as initSetList} from '../../components/set-list/enhancement';

export default function (del) {
	this.data.lists.forEach(list => {
		initSetList(del, list);
	})

}