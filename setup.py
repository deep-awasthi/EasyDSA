import setuptools

with open("README.md", "r") as fh:
    long_description = fh.read()

setuptools.setup(
    name="DataStructure",
    version="0.0.1",
    author="Deep Awasthi",
    author_email="da.madskull@gmail.com",
    description="Package with several data structures implemented.",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/mad-skull/datastructure", # Github repository
    packages=setuptools.find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires='>=3.9',
)