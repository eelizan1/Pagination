package com.pagination.pagination.repository;

import com.pagination.pagination.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends PagingAndSortingRepository<User, Long> {
    // findByNameContaining is structured so that it can be interpreted as a query
    Page<User> findByNameContaining(String name, Pageable pageable);
}
