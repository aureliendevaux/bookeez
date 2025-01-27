export const policies = {
	BookTypePolicy: () => import('#policies/book_type_policy'),
	PublisherPolicy: () => import('#policies/publisher_policy'),
};
