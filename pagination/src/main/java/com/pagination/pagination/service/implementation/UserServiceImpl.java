package com.pagination.pagination.service.implementation;

import com.pagination.pagination.domain.User;
import com.pagination.pagination.repository.UserRepository;
import com.pagination.pagination.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.data.domain.PageRequest.of;

/**
 * @author Get Arrays (https://www.getarrays.io/)
 * @version 1.0
 * @since 6/26/2022
 */

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    @Override
    public Page<User> getUsers(String name, int page, int size) {
        log.info("Fetching users for page {} of size {}", page, size);
        // page - the requested page from UI eg page 1, page 2, etc..
        // size - the amount of items we want per page
        return userRepository.findByNameContaining(name, of(page, size));
    }
}