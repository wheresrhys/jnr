'use strict';

export default function () {
	this.isPersistable = true;
	this.save = function () {
		fetch(`/api/${this.dataType}${this.id ? '/' + this.id : ''}`, {
			method: this.id ? 'PUT' : 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(this.state)
		})
	}
};

